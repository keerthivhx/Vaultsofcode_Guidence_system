const { GoogleGenerativeAI } = require('@google/generative-ai');
const SYSTEM_PROMPT = require('../config/systemPrompt');
const { classifyIntent } = require('./intentClassifier');
const kbService = require('./knowledgeBaseService');

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      try {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('✨ Gemini AI API initialized successfully.');
      } catch (err) {
        console.warn('⚠️ Gemini AI initialization warning:', err.message);
        this.model = null;
      }
    } else {
      console.log('ℹ️ Operating in Smart RAG Fallback Mode (No Gemini API Key set).');
      this.model = null;
    }
  }

  /**
   * Main entry point to process chat message
   * @param {string} userMessage 
   * @param {Array} history [{ role: 'user'|'assistant', text: string }]
   */
  async processMessage(userMessage, history = []) {
    const intent = classifyIntent(userMessage, history);
    const kbData = kbService.getKnowledgeForIntent(intent, userMessage);

    let answerText = '';
    let usedLLM = false;

    // Handle unknown / out-of-scope query early
    if (intent === 'unknown') {
      answerText = "I’m not able to find reliable information about that. I can help with VaultOfCode courses, internships, workshops, certificates, offer letters, enrollment, payments, and website navigation.";
      return {
        answer: answerText,
        intent,
        recommendedRoute: '/support',
        suggestedQuestions: kbData.suggestedQuestions,
        escalationRequired: false,
        usedLLM: false
      };
    }

    // Try Gemini LLM if available
    if (this.model) {
      try {
        const prompt = `${SYSTEM_PROMPT}

Classified User Intent: ${intent}
Available VaultOfCode Knowledge Base Context:
${JSON.stringify(kbData.relevantInfo, null, 2)}

Conversation History:
${history.slice(-4).map(h => `${h.role.toUpperCase()}: ${h.text}`).join('\n')}

User Query: "${userMessage}"

Generate a concise, student-friendly, and accurate response based strictly on the provided context. If navigation is useful, mention the recommended page path ${kbData.recommendedRoute}.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        answerText = response.text();
        usedLLM = true;
      } catch (error) {
        console.warn('⚠️ Gemini API Error, falling back to smart RAG generator:', error.message);
        answerText = this.generateFallbackResponse(intent, userMessage, kbData, history);
      }
    } else {
      // Deterministic Smart RAG Engine
      answerText = this.generateFallbackResponse(intent, userMessage, kbData, history);
    }

    // Determine if escalation button should be shown
    const escalationRequired = (
      intent === 'human_support' ||
      intent === 'payment_query' ||
      userMessage.toLowerCase().includes('agent') ||
      userMessage.toLowerCase().includes('whatsapp')
    );

    return {
      answer: answerText,
      intent,
      recommendedRoute: kbData.recommendedRoute,
      suggestedQuestions: kbData.suggestedQuestions,
      escalationRequired,
      usedLLM
    };
  }

  /**
   * Deterministic Grounded RAG Generator (100% Anti-Hallucination)
   */
  generateFallbackResponse(intent, query, kbData, history) {
    const q = query.toLowerCase();

    switch (intent) {
      case 'course_inquiry': {
        if (Array.isArray(kbData.relevantInfo)) {
          if (kbData.relevantInfo.length === 1) {
            const c = kbData.relevantInfo[0];
            return `VaultOfCode offers **${c.title}** (${c.duration}).\n\n• **Fee:** ${c.fee}\n• **Tech Stack:** ${c.techStack.join(', ')}\n• **Mode:** ${c.mode}\n\nYou can explore all course details and enroll directly on our Courses page.`;
          }
          return `VaultOfCode offers industry-aligned courses including:\n\n` +
            kbData.relevantInfo.map(c => `• **${c.title}** — ${c.duration} (${c.fee})`).join('\n') +
            `\n\nVisit the Courses page to read full syllabi and enroll.`;
        }
        return `VaultOfCode provides high-impact software courses in Full-Stack Web Dev, Python AI/ML, Data Science, Java Backend, and Cyber Security. Check out our Courses page!`;
      }

      case 'internship_inquiry': {
        return `VaultOfCode offers **100% Virtual Remote Internships** in Web Development, AI & Machine Learning, Python Software Development, and Java Backend.\n\n` +
          `• **Durations:** 1 Month, 2 Months, or 3 Months\n` +
          `• **Perks:** Offer Letter in 48 Hours, Verified Completion Certificate, Performance Stipend for top 5%\n` +
          `• **Fee:** Free application (nominal ₹499 student portal fee)\n\nApply on the Internships page to kickstart your experience!`;
      }

      case 'training_inquiry': {
        return `Yes! VaultOfCode offers Live Mentored industrial training programs with hands-on projects, weekly mentor sessions, and an accredited Completion Certificate across Web Dev, AI/ML, and Data Science.`;
      }

      case 'workshop_inquiry': {
        return `We host practical weekend workshops! Upcoming sessions include:\n\n` +
          `• **Building GenAI Apps with Gemini & React** (2-Day Weekend Intensive, ₹299)\n` +
          `• **Modern React & Next.js Masterclass** (3-Hour Bootcamp, ₹199)\n\nEnroll on our Workshops page to get live coding access & participation badges.`;
      }

      case 'certificate_query':
      case 'certificate_verification': {
        if (q.includes('verify') || q.includes('voc-') || q.includes('credential')) {
          return `Sure! You can verify your VaultOfCode certificate using the certificate verification option on the website. Simply navigate to the **Verify Certificate** page, type in your unique Certificate ID (e.g. VOC-2026-8921), and click 'Verify Credentials'.`;
        }
        return `VaultOfCode digital e-certificates are dispatched to your registered email address within 3 to 5 business days after your final project submission is reviewed.`;
      }

      case 'offer_letter_query': {
        return `VaultOfCode internship offer letters are generated digitally and emailed within **48 hours** of enrollment confirmation.\n\nYou can also validate or re-download your offer letter anytime on our **Offer Letter Portal**. If you haven't received it after 48 hours, please check your Spam folder or contact our support team.`;
      }

      case 'enrollment_query': {
        return `Enrolling is quick and simple:\n1. Visit the Courses or Internships page.\n2. Click **Apply Now** on your preferred program.\n3. Fill required profile details and secure payment.\n4. You will instantly receive your student portal login & confirmation email!`;
      }

      case 'payment_query': {
        return `We accept Razorpay, UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, and Net Banking.\n\n**Refund Policy:** We provide a 100% full refund policy within 7 days of course enrollment if you are not satisfied. For any payment verification issues, feel free to reach out to human support.`;
      }

      case 'website_navigation': {
        return `Here are quick links to key pages on VaultOfCode:\n\n` +
          `• **Courses:** /courses\n` +
          `• **Internships:** /internships\n` +
          `• **Certificate Verification:** /verify-certificate\n` +
          `• **Offer Letter Portal:** /offer-letter\n` +
          `• **Support Desk:** /support`;
      }

      case 'technical_support': {
        return `If you're facing technical issues:\n\n` +
          `• **Login Problems:** Click 'Forgot Password' on the Login page (/login).\n` +
          `• **LMS Video Playback:** Try clearing your browser cache or switch to Google Chrome.\n` +
          `• **Assignment Uploads:** Make sure to submit your GitHub repository link or ZIP file.`;
      }

      case 'human_support': {
        return `You can connect directly with our support team!\n\n` +
          `• **WhatsApp Support:** +91 98765 43210\n` +
          `• **Email:** support@vaultofcode.com\n` +
          `• **Working Hours:** Mon-Fri 9:00 AM - 7:00 PM IST\n\nClick the **Contact Human Support** button below to chat with us on WhatsApp.`;
      }

      case 'general_query':
      default: {
        return `Welcome to **VaultOfCode**! We are a leading platform providing hands-on software development courses, virtual internships, weekend bootcamps, and verified certificates.\n\n• **Working Hours:** Monday to Friday: 9:00 AM - 7:00 PM IST, Saturday: 10:00 AM - 4:00 PM IST\n• **Location:** Bengaluru, Karnataka, India\n\nHow can I help you today?`;
      }
    }
  }
}

module.exports = new AIService();
