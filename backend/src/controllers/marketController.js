const MarketData = require('../models/MarketData');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get market stats for a specific crop
// @route   GET /api/market/stats/:crop
// @access  Private
exports.getCropMarketStats = async (req, res, next) => {
    try {
        const crop = req.params.crop.toLowerCase();
        const data = await MarketData.findOne({ cropName: new RegExp(`^${crop}$`, 'i') });

        if (!data) {
            // Return mock data fallback
            return res.status(200).json(formatResponse(true, 'Mock market data retrieved', {
                cropName: req.params.crop,
                currentPrice: 2200,
                priceChange: 5.2,
                sellStatus: 'Best',
                historicalPrices: [
                    { month: 'Jan', price: 1900 },
                    { month: 'Feb', price: 2000 },
                    { month: 'Mar', price: 2100 },
                    { month: 'Apr', price: 2200 }
                ],
                yieldTrend: [
                    { year: '2021', yieldValue: 22 },
                    { year: '2022', yieldValue: 24 },
                    { year: '2023', yieldValue: 25 }
                ]
            }));
        }

        res.status(200).json(formatResponse(true, 'Market stats retrieved', data));
    } catch (error) {
        next(error);
    }
};

// @desc    Get all active sell opportunities
// @route   GET /api/market/opportunities
// @access  Private
exports.getMarketOpportunities = async (req, res, next) => {
    try {
        const opportunities = await MarketData.find({ sellStatus: 'Best' });
        res.status(200).json(formatResponse(true, 'Market opportunities retrieved', opportunities));
    } catch (error) {
        next(error);
    }
};
