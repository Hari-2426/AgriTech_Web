const express = require('express');
const router = express.Router();
const { getCropMarketStats, getMarketOpportunities } = require('../controllers/marketController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/stats/:crop', protect, getCropMarketStats);
router.get('/opportunities', protect, getMarketOpportunities);

module.exports = router;
