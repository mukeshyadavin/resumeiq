const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  analyze,
  getAnalyses,
  getAnalysis
} = require('../controllers/analyzeController');

router.post('/',     protect, analyze);
router.get('/',      protect, getAnalyses);
router.get('/:id',   protect, getAnalysis);

module.exports = router;