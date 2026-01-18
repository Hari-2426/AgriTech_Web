const mongoose = require('mongoose');

const AssistantQuerySchema = new mongoose.Schema({
    keywords: [String],
    response_en: {
        type: String,
        required: true
    },
    response_te: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['CropSelection', 'Market', 'Disease', 'General'],
        default: 'General'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AssistantQuery', AssistantQuerySchema);
