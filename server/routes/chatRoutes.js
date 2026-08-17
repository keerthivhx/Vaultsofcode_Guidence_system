const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { validateChatInput } = require('../middleware/sanitizer');
const chatRateLimiter = require('../middleware/rateLimiter');

// POST /api/chat - Main conversation endpoint
router.post('/', chatRateLimiter, validateChatInput, async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const responseData = await aiService.processMessage(message, history);

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/chat/intents - List supported intents
router.get('/intents', (req, res) => {
  const { INTENTS } = require('../services/intentClassifier');
  res.json({
    success: true,
    intents: INTENTS
  });
});

module.exports = router;
