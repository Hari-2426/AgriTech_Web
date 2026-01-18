const RegionalData = require('../models/RegionalData');
const Analysis = require('../models/Analysis');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get regional insights (AP & Telangana)
// @route   GET /api/analytics/region
// @access  Private
exports.getRegionalAnalytics = async (req, res, next) => {
    try {
        const { state, district, season } = req.query;

        if (!state || !district) {
            res.status(400);
            throw new Error('State and District are required');
        }

        const data = await RegionalData.findOne({ state, district });

        if (!data) {
            // Return default/mock data if not found in DB
            return res.status(200).json(formatResponse(true, 'Data not found, returning defaults', {
                state,
                district,
                season: season || 'Kharif',
                distribution: [
                    { name: 'Rice', value: 45 },
                    { name: 'Cotton', value: 25 },
                    { name: 'Chili', value: 15 },
                    { name: 'Maize', value: 15 }
                ],
                profitability: [
                    { name: 'Rice', value: 25000 },
                    { name: 'Cotton', value: 35000 },
                    { name: 'Chili', value: 45000 },
                    { name: 'Maize', value: 22000 }
                ]
            }));
        }

        const activeSeason = data.seasons.find(s => s.name === (season || 'Kharif')) || data.seasons[0];

        res.status(200).json(formatResponse(true, 'Regional analytics retrieved', {
            state: data.state,
            district: data.district,
            avgRainfall: data.avgRainfall,
            soilType: data.soilType,
            season: activeSeason.name,
            distribution: activeSeason.distribution,
            profitability: activeSeason.profitability
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard summary metrics
// @route   GET /api/dashboard/summary
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
    try {
        const farmerId = req.user.id;

        // 1. Calculate Farm Health Score based on actual scan history
        const scans = await Analysis.find({ farmerId }).limit(10);
        let healthScore = 85; // Baseline

        if (scans.length > 0) {
            const avgSeverity = scans.reduce((acc, scan) => acc + scan.severity, 0) / scans.length;
            healthScore = Math.max(0, 100 - avgSeverity);
        }

        // 2. Mock some other metrics based on farmer profile
        const waterSaved = req.user.landSize * 1500; // liters estimation

        res.status(200).json(formatResponse(true, 'Dashboard summary retrieved', {
            healthScore: Math.round(healthScore),
            waterSaved,
            activeAlerts: 2,
            totalScans: scans.length,
            recentCropStatus: scans[0]?.diseaseName || 'Healthy'
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Get platform-wide overview stats
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res, next) => {
    try {
        res.status(200).json(formatResponse(true, 'Platform overview retrieved', {
            totalFarmers: 1240,
            healthyCropsPercentage: 92,
            totalWaterSaved: '4.2M Liters',
            activeStateAlerts: 5
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Get detailed regional insights
// @route   GET /api/analytics/regional-insights/:state/:district
// @access  Private
exports.getRegionalInsights = async (req, res, next) => {
    try {
        const { state, district } = req.params;
        const data = await RegionalData.findOne({ state, district });

        if (!data) {
            res.status(404);
            throw new Error('Regional data not found');
        }

        res.status(200).json(formatResponse(true, 'Regional insights retrieved', data));
    } catch (error) {
        next(error);
    }
};

// @desc    Get smart crop recommendations
// @route   GET /api/analytics/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
    try {
        const { state, district } = req.user; // From Auth Middleware
        const data = await RegionalData.findOne({ state, district });

        const seasonData = data?.seasons[0] || {
            profitability: [
                { name: 'Chili', value: 55000 },
                { name: 'Cotton', value: 42000 },
                { name: 'Rice', value: 28000 }
            ]
        };

        // Sort by profitability and take top 3
        const recommendations = [...seasonData.profitability]
            .sort((a, b) => b.value - a.value)
            .slice(0, 3);

        res.status(200).json(formatResponse(true, 'Recommendations retrieved', recommendations));
    } catch (error) {
        next(error);
    }
};
