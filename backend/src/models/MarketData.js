const mongoose = require('mongoose');

const MarketDataSchema = new mongoose.Schema({
    cropName: {
        type: String,
        required: true,
        unique: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    previousPrice: {
        type: Number,
        required: true
    },
    priceChange: {
        type: Number, // percentage
        required: true
    },
    sellStatus: {
        type: String,
        enum: ['Best', 'Average', 'Wait'],
        default: 'Average'
    },
    historicalPrices: [{
        month: String,
        price: Number
    }],
    yieldTrend: [{
        year: String,
        yieldValue: Number
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('MarketData', MarketDataSchema);
