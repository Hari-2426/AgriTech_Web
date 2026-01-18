const mongoose = require('mongoose');

const AlertSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    type: {
        type: String,
        enum: ['Weather', 'Water', 'Pest', 'Market'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Alert', AlertSchema);
