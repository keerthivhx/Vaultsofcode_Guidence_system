const rateLimit = require('express-rate-limit');

const chatRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many chat requests from this IP address. Please try again after 15 minutes.'
  }
});

module.exports = chatRateLimiter;
