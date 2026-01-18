const mongoose = require('mongoose');

const CropDiseaseSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true
    },
    diseaseName: {
        type: String,
        required: true
    },
    symptoms: [String],
    remedies: [String],
    prevention: [String],
    severityRange: {
        min: { type: Number, default: 10 },
        max: { type: Number, default: 95 }
    },
    keywords: [String] // Keywords to look for in filename
});

module.exports = mongoose.model('CropDisease', CropDiseaseSchema);
