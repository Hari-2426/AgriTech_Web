const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const Farmer = require('../models/Farmer');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res, next) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            res.status(400);
            throw new Error('Please provide a phone number');
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to DB
        const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRY || '300000'));
        await OTP.findOneAndUpdate(
            { phone },
            { code, expiresAt },
            { upspeak: true, new: true, upsert: true }
        );

        // In a production app, we would use an SMS gateway here (Twilio, Gupshup, etc.)
        // For now, we'll return it in the response for demo purposes (mock)
        res.status(200).json(formatResponse(true, 'OTP sent successfully', {
            phone,
            debug_otp: code // remove in production
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP and return JWT
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, code } = req.body;

        if (!phone || !code) {
            res.status(400);
            throw new Error('Please provide phone and OTP');
        }

        const otpRecord = await OTP.findOne({ phone, code });

        if (!otpRecord) {
            res.status(400);
            throw new Error('Invalid or expired OTP');
        }

        // Clear OTP after use
        await OTP.deleteOne({ _id: otpRecord._id });

        // Check if farmer is registered
        const farmer = await Farmer.findOne({ phone });

        if (!farmer) {
            return res.status(200).json(formatResponse(true, 'OTP verified. Please complete registration.', {
                isRegistered: false,
                phone
            }));
        }

        // Issue JWT
        const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(200).json(formatResponse(true, 'Login successful', {
            isRegistered: true,
            token,
            farmer
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const farmer = await Farmer.findById(req.user.id);
        res.status(200).json(formatResponse(true, 'User data retrieved', farmer));
    } catch (error) {
        next(error);
    }
};
