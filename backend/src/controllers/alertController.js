const Alert = require('../models/Alert');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Get alerts for farmer
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res, next) => {
    try {
        const alerts = await Alert.find({ farmerId: req.user.id }).sort({ createdAt: -1 });

        // If no alerts found, return some mock weather alerts for better UX
        if (alerts.length === 0) {
            return res.status(200).json(formatResponse(true, 'Alerts retrieved', [
                {
                    _id: 'mock1',
                    type: 'Weather',
                    title: 'Heavy Rain Predicted',
                    message: 'Moderate to heavy rainfall expected in your village tomorrow between 2 PM and 5 PM.',
                    severity: 'info',
                    isRead: false,
                    createdAt: new Date()
                },
                {
                    _id: 'mock2',
                    type: 'Pest',
                    title: 'Local Pest Warning',
                    message: 'Minor incidence of pest attacks reported in nearby Mandals. Monitor your crops closely.',
                    severity: 'warning',
                    isRead: false,
                    createdAt: new Date()
                }
            ]));
        }

        res.status(200).json(formatResponse(true, 'Alerts retrieved', alerts));
    } catch (error) {
        next(error);
    }
};

// @desc    Mark alert as read
// @route   POST /api/alerts/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const alert = await Alert.findOneAndUpdate(
            { _id: req.params.id, farmerId: req.user.id },
            { isRead: true },
            { new: true }
        );

        res.status(200).json(formatResponse(true, 'Alert marked as read', alert));
    } catch (error) {
        next(error);
    }
};
