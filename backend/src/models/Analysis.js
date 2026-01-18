const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    cropName: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    severity: {
        type: Number,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    results: {
        symptoms: [String],
        remedies: [String],
        prevention: [String]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Analysis', AnalysisSchema);
