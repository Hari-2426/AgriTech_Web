const mongoose = require('mongoose');

const RegionalDataSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true,
        enum: ['Andhra Pradesh', 'Telangana']
    },
    district: {
        type: String,
        required: true
    },
    dominantCrops: [String],
    avgRainfall: String,
    soilType: String,
    seasons: [{
        name: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'] },
        distribution: [{
            name: String,
            value: Number // percentage
        }],
        profitability: [{
            name: String,
            value: Number // profit in rupees
        }]
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('RegionalData', RegionalDataSchema);
