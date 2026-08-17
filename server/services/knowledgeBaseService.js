const kbData = require('../data/knowledgeBase.json');

/**
 * Retrieves matching knowledge items based on classified intent and user query.
 * Implements strict anti-hallucination grounding.
 */
class KnowledgeBaseService {
  constructor() {
    this.kb = kbData;
  }

  getKnowledgeForIntent(intent, query = '') {
    const q = query.toLowerCase();
    const result = {
      intent,
      platform: this.kb.platform,
      relevantInfo: null,
      recommendedRoute: null,
      suggestedQuestions: []
    };

    switch (intent) {
      case 'course_inquiry': {
        const matchedCourses = this.kb.courses.filter(c => 
          q.includes(c.category.toLowerCase()) || 
          q.includes(c.title.toLowerCase()) ||
          c.techStack.some(t => q.includes(t.toLowerCase()))
        );

        result.relevantInfo = matchedCourses.length > 0 ? matchedCourses : this.kb.courses;
        result.recommendedRoute = '/courses';
        result.suggestedQuestions = [
          'What is the fee for Full-Stack Web Development?',
          'What is covered in the Python AI/ML course?',
          'How do I apply for a course?'
        ];
        break;
      }

      case 'training_inquiry': {
        result.relevantInfo = {
          courses: this.kb.courses,
          internships: this.kb.internships,
          note: "VaultOfCode offers industrial training with live mentorship across Web Dev, AI/ML, and Data Science."
        };
        result.recommendedRoute = '/courses';
        result.suggestedQuestions = [
          'What is the duration of industrial training?',
          'Do you provide certificates for training?',
          'How to enroll in mentored training?'
        ];
        break;
      }

      case 'internship_inquiry': {
        const matchedInternships = this.kb.internships.filter(i =>
          q.includes(i.domain.toLowerCase()) || q.includes(i.title.toLowerCase())
        );

        result.relevantInfo = matchedInternships.length > 0 ? matchedInternships : this.kb.internships;
        result.recommendedRoute = '/internships';
        result.suggestedQuestions = [
          'Are VaultOfCode internships 100% remote?',
          'Is there a stipend for top performers?',
          'When do I receive my offer letter?'
        ];
        break;
      }

      case 'workshop_inquiry': {
        result.relevantInfo = this.kb.workshops;
        result.recommendedRoute = '/workshops';
        result.suggestedQuestions = [
          'What workshops are available this weekend?',
          'What is the fee for the GenAI workshop?',
          'Do workshop participants get certificates?'
        ];
        break;
      }

      case 'certificate_query':
      case 'certificate_verification': {
        result.relevantInfo = this.kb.certificates;
        result.recommendedRoute = '/verify-certificate';
        result.suggestedQuestions = [
          'How can I verify my certificate?',
          'When will my certificate arrive?',
          'Where do I enter my Certificate ID?'
        ];
        break;
      }

      case 'offer_letter_query': {
        result.relevantInfo = this.kb.offerLetters;
        result.recommendedRoute = '/offer-letter';
        result.suggestedQuestions = [
          'How long does it take to get an offer letter?',
          'What if I haven\'t received my offer letter after 48 hours?',
          'How do I verify my offer letter?'
        ];
        break;
      }

      case 'enrollment_query': {
        result.relevantInfo = this.kb.enrollmentAndPayments;
        result.recommendedRoute = '/courses';
        result.suggestedQuestions = [
          'What are the steps to enroll?',
          'Can I enroll in multiple internships?',
          'What payment options are available?'
        ];
        break;
      }

      case 'payment_query': {
        result.relevantInfo = {
          methods: this.kb.enrollmentAndPayments.paymentMethods,
          refundPolicy: this.kb.enrollmentAndPayments.refundPolicy,
          supportEmail: this.kb.platform.contactEmail
        };
        result.recommendedRoute = '/courses';
        result.suggestedQuestions = [
          'What is your refund policy?',
          'Do you accept UPI and Razorpay?',
          'I was charged twice, how do I get help?'
        ];
        break;
      }

      case 'website_navigation': {
        result.relevantInfo = this.kb.websiteRoutes;
        
        // Find best matching route
        const routeMatch = this.kb.websiteRoutes.find(r => 
          q.includes(r.name.toLowerCase()) || q.includes(r.path.toLowerCase())
        );

        result.recommendedRoute = routeMatch ? routeMatch.path : '/';
        result.suggestedQuestions = [
          'Where is the Certificate Verification page?',
          'Where can I see available Courses?',
          'How do I reach Technical Support?'
        ];
        break;
      }

      case 'technical_support': {
        result.relevantInfo = this.kb.technicalSupport;
        result.recommendedRoute = '/support';
        result.suggestedQuestions = [
          'How do I reset my student dashboard password?',
          'My video lecture is not loading, what to do?',
          'How do I submit my project assignments?'
        ];
        break;
      }

      case 'human_support': {
        result.relevantInfo = {
          whatsApp: this.kb.platform.whatsAppSupport,
          email: this.kb.platform.contactEmail,
          hours: this.kb.platform.workingHours
        };
        result.recommendedRoute = '/support';
        result.suggestedQuestions = [
          'Connect me to WhatsApp Support',
          'What are the support working hours?',
          'Can someone help me with payment confirmation?'
        ];
        break;
      }

      case 'general_query': {
        result.relevantInfo = this.kb.platform;
        result.recommendedRoute = '/';
        result.suggestedQuestions = [
          'What is VaultOfCode?',
          'What courses and internships do you offer?',
          'How can I verify my certificate?'
        ];
        break;
      }

      case 'unknown':
      default: {
        result.relevantInfo = null;
        result.recommendedRoute = '/support';
        result.suggestedQuestions = [
          'What courses does VaultOfCode offer?',
          'How to verify a certificate?',
          'How to apply for a virtual internship?'
        ];
        break;
      }
    }

    return result;
  }

  getAllRoutes() {
    return this.kb.websiteRoutes;
  }

  getPlatformInfo() {
    return this.kb.platform;
  }
}

module.exports = new KnowledgeBaseService();
