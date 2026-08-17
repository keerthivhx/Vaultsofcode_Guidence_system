/**
 * Input Sanitization & Anti-Prompt-Injection Middleware
 */

const validateChatInput = (req, res, next) => {
  const { message, history } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message field is required and must be a non-empty string.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message exceeds maximum allowed character limit (1000 characters).' });
  }

  // Prevent prompt injection attempts (e.g. system override instructions)
  const injectionPatterns = [
    /ignore all previous instructions/i,
    /system prompt/i,
    /you are now Dan/i,
    /forget your rules/i,
    /<script>/i
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(message)) {
      return res.status(400).json({
        error: 'Invalid or unsafe input detected. Please rephrase your query.'
      });
    }
  }

  // Sanitize message string
  req.body.message = message.trim();

  // Validate history structure
  if (history && !Array.isArray(history)) {
    req.body.history = [];
  }

  next();
};

module.exports = {
  validateChatInput
};
