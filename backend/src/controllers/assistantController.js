const AssistantQuery = require('../models/AssistantQuery');
const { formatResponse } = require('../utils/responseFormatter');

// @desc    Handle assistant query
// @route   POST /api/assistant/query
// @access  Private
exports.handleQuery = async (req, res, next) => {
    try {
        const { text, lang } = req.body;

        if (!text) {
            res.status(400);
            throw new Error('Query text is required');
        }

        const lowerText = text.toLowerCase();

        // Find best matching query
        const allQueries = await AssistantQuery.find();
        let bestMatch = null;

        for (const query of allQueries) {
            const hasKeyword = query.keywords.some(kw => lowerText.includes(kw.toLowerCase()));
            if (hasKeyword) {
                bestMatch = query;
                break;
            }
        }

        let responseText;
        if (bestMatch) {
            responseText = lang === 'te' ? bestMatch.response_te : bestMatch.response_en;
        } else {
            responseText = lang === 'te'
                ? 'క్షమించండి, నాకు అర్థం కాలేదు. "ఏ పంట బాగుంటుంది?" లేదా "మార్కెట్ ఎలా ఉంది?" అని అడగండి.'
                : "I'm sorry, I didn't quite catch that. Try asking about crops, market prices, or selling times.";
        }

        res.status(200).json(formatResponse(true, 'Assistant response retrieved', {
            response: responseText,
            category: bestMatch ? bestMatch.category : 'General'
        }));
    } catch (error) {
        next(error);
    }
};
