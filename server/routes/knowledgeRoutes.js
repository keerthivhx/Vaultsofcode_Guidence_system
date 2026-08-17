const express = require('express');
const router = express.Router();
const kbService = require('../services/knowledgeBaseService');

// GET /api/knowledge - Retrieve full public knowledge base
router.get('/', (req, res) => {
  res.json({
    success: true,
    platform: kbService.getPlatformInfo(),
    routes: kbService.getAllRoutes()
  });
});

// GET /api/knowledge/routes - List site navigation routes
router.get('/routes', (req, res) => {
  res.json({
    success: true,
    routes: kbService.getAllRoutes()
  });
});

module.exports = router;
