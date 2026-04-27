const express = require('express');
const router = express.Router();
const { getMonthlySummary, getYearlySummary } = require('../controllers/summaryController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getMonthlySummary);
router.get('/yearly', getYearlySummary);

module.exports = router;
