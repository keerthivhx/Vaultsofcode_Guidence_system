/**
 * Intent Classifier Service for VaultOfCode Support Assistant
 * Features hybrid AI + Semantic Pattern Matching to accurately determine intent
 */

const INTENTS = [
  'course_inquiry',
  'training_inquiry',
  'internship_inquiry',
  'workshop_inquiry',
  'certificate_query',
  'certificate_verification',
  'offer_letter_query',
  'enrollment_query',
  'payment_query',
  'website_navigation',
  'technical_support',
  'human_support',
  'general_query',
  'unknown'
];

/**
 * Priority Order for Intent Matching
 */
const INTENT_PATTERNS = [
  {
    intent: 'unknown',
    patterns: [
      /\b(flight|ticket|weather|recipe|paris|bitcoin|cricket|football|shoe)\b/i
    ]
  },
  {
    intent: 'human_support',
    patterns: [
      /\b(human|person|agent|representative|talk to someone|call|whatsapp|speak to|contact support|customer care)\b/i
    ]
  },
  {
    intent: 'website_navigation',
    patterns: [
      /\b(where is|located on|how to navigate|find the page|url for|link to)\b/i
    ]
  },
  {
    intent: 'certificate_verification',
    patterns: [
      /\b(verify.*certific|check.*credential|validate.*id|voc-\d+)\b/i
    ]
  },
  {
    intent: 'certificate_query',
    patterns: [
      /\b(completion cert|download cert|when will i get cert|degree|completion certificate|certificate)\b/i
    ]
  },
  {
    intent: 'offer_letter_query',
    patterns: [
      /\b(offer letter|appointment letter|joining letter|haven't received letter|get my letter)\b/i
    ]
  },
  {
    intent: 'enrollment_query',
    patterns: [
      /\b(how do i enroll|how to enroll|enroll in|apply for course|registration steps|how to join|how to register|eligibility)\b/i
    ]
  },
  {
    intent: 'technical_support',
    patterns: [
      /\b(login|password|lms|video|dashboard|canvas|portal error|bug|submission|cannot access|trouble logging)\b/i
    ]
  },
  {
    intent: 'internship_inquiry',
    patterns: [
      /\b(internships?|virtual intern|stipend|remote intern|lor|recommendation letter)\b/i
    ]
  },
  {
    intent: 'workshop_inquiry',
    patterns: [
      /\b(workshops?|weekend session|webinar|genai workshop|masterclass)\b/i
    ]
  },
  {
    intent: 'training_inquiry',
    patterns: [
      /\b(industrial training|mentorship program|mentored training)\b/i
    ]
  },
  {
    intent: 'course_inquiry',
    patterns: [
      /\b(what courses|courses do you offer|course details|fullstack|python|data science|java|cyber security|curriculum)\b/i
    ]
  },
  {
    intent: 'payment_query',
    patterns: [
      /\b(payment|refund|upi|razorpay|paid|billing|receipt)\b/i
    ]
  },
  {
    intent: 'general_query',
    patterns: [
      /\b(about vaultofcode|what is vaultofcode|working hours|location|office|who are you)\b/i
    ]
  }
];

/**
 * Classifies user text into intent based on text and past turn context.
 * @param {string} text 
 * @param {Array} history 
 * @returns {string} Intent name
 */
function classifyIntent(text, history = []) {
  if (!text || typeof text !== 'string') return 'unknown';

  const cleanedText = text.trim().toLowerCase();

  // Combine current text with recent history context for short queries
  const recentUserContext = history
    .filter(h => h.role === 'user')
    .slice(-2)
    .map(h => h.text.toLowerCase())
    .join(' ');

  // 1. Direct Pattern Checking in Prioritized List
  for (const { intent, patterns } of INTENT_PATTERNS) {
    for (const regex of patterns) {
      if (regex.test(cleanedText)) {
        return intent;
      }
    }
  }

  // 2. Context-aware short query resolution
  if (cleanedText.length <= 15 && recentUserContext) {
    for (const { intent, patterns } of INTENT_PATTERNS) {
      for (const regex of patterns) {
        if (regex.test(recentUserContext + ' ' + cleanedText)) {
          return intent;
        }
      }
    }
  }

  // 3. Fallback check for general greeting
  if (/hi|hello|hey|greetings|good morning|good evening/i.test(cleanedText)) {
    return 'general_query';
  }

  return 'general_query';
}

module.exports = {
  classifyIntent,
  INTENTS
};
