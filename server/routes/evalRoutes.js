const express = require('express');
const router = express.Router();
const evalService = require('../services/evaluationService');
const testDataset = require('../data/testDataset.json');

// GET /api/eval/dataset - Return benchmark dataset
router.get('/dataset', (req, res) => {
  res.json({
    success: true,
    total: testDataset.length,
    dataset: testDataset
  });
});

// POST /api/eval/run - Run full automated evaluation suite
router.post('/run', async (req, res, next) => {
  try {
    const report = await evalService.runEvaluation();
    res.json({
      success: true,
      report
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
