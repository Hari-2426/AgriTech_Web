const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
    farmerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
        enum: ['Andhra Pradesh', 'Telangana']
    },
    district: {
        type: String,
        required: true
    },
    village: {
        type: String,
        required: true
    },
    landSize: {
        type: Number,
        required: true
    },
    crops: [{
        type: String
    }],
    pincode: {
        type: String
    },
    aadhaar: {
        type: String
    },
    profileImage: {
        type: String,
        default: ''
    },
    location: {
        lat: Number,
        lng: Number,
        accuracy: Number,
        capturedAt: {
            type: Date,
            default: Date.now
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Farmer', FarmerSchema);
