const jwt = require('jsonwebtoken');
const Farmer = require('../models/Farmer');
const { formatResponse } = require('../utils/responseFormatter');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get farmer from token
            req.user = await Farmer.findById(decoded.id).select('-__v');

            if (!req.user) {
                res.status(401);
                throw new Error('User not found');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json(formatResponse(false, 'Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401).json(formatResponse(false, 'Not authorized, no token'));
    }
};

module.exports = { protect };
