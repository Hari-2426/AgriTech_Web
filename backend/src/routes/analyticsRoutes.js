const express = require('express');
const router = express.Router();
const {
    getRegionalAnalytics,
    getDashboardSummary,
    getOverview,
    getRegionalInsights,
    getRecommendations
} = require('../controllers/analyticsController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/region', protect, getRegionalAnalytics);
router.get('/dashboard-summary', protect, getDashboardSummary);
router.get('/overview', getOverview);
router.get('/regional-insights/:state/:district', protect, getRegionalInsights);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;
