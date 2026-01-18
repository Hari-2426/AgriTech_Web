const Farmer = require('../models/Farmer');
const jwt = require('jsonwebtoken');
const { formatResponse } = require('../utils/responseFormatter');

// Helper to generate Farmer ID
const generateFarmerId = async (state) => {
    const stateCode = state === 'Andhra Pradesh' ? 'AP' : 'TG';
    const year = new Date().getFullYear();

    // Find the latest farmer from this state/year to increment sequence
    const latestFarmer = await Farmer.findOne({
        farmerId: new RegExp(`^AGRI-${stateCode}-${year}-`)
    }).sort({ createdAt: -1 });

    let sequence = '000001';
    if (latestFarmer) {
        const lastSeq = parseInt(latestFarmer.farmerId.split('-').pop());
        sequence = (lastSeq + 1).toString().padStart(6, '0');
    }

    return `AGRI-${stateCode}-${year}-${sequence}`;
};

// @desc    Register a new farmer
// @route   POST /api/farmer/register
// @access  Public
exports.registerFarmer = async (req, res, next) => {
    try {
        const { name, phone, state, district, village, landSize, crops, pincode, aadhaar, location } = req.body;

        // Validation
        if (!name || !phone || !state || !district || !village || !landSize) {
            res.status(400);
            throw new Error('Please provide all mandatory fields');
        }

        // Check if farmer already exists
        const existingFarmer = await Farmer.findOne({ phone });
        if (existingFarmer) {
            res.status(400);
            throw new Error('Farmer with this phone number already exists');
        }

        // Generate ID
        const farmerId = await generateFarmerId(state);

        // Create Farmer
        const farmer = await Farmer.create({
            farmerId,
            name,
            phone,
            state,
            district,
            village,
            landSize,
            crops,
            pincode,
            aadhaar,
            location
        });

        // Issue JWT for auto-login
        const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.status(201).json(formatResponse(true, 'Registration successful', {
            token,
            farmer
        }));
    } catch (error) {
        next(error);
    }
};

// @desc    Get farmer profile
// @route   GET /api/farmer/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
    try {
        const farmer = await Farmer.findById(req.user.id);
        res.status(200).json(formatResponse(true, 'Profile retrieved', farmer));
    } catch (error) {
        next(error);
    }
};

// @desc    Update farmer profile
// @route   PUT /api/farmer/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const allowedUpdates = ['name', 'village', 'mandal', 'crops', 'landSize', 'pincode', 'profileImage'];
        const updates = {};

        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const farmer = await Farmer.findByIdAndUpdate(req.user.id, updates, {
            new: true,
            runValidators: true
        });

        res.status(200).json(formatResponse(true, 'Profile updated successfully', farmer));
    } catch (error) {
        next(error);
    }
};
