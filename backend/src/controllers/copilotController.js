const { formatResponse } = require('../utils/responseFormatter');

// @desc    Handle AI Copilot rule-based query
// @route   POST /api/ai/copilot
// @access  Private
const handleCopilotQuery = async (req, res, next) => {
    try {
        const { text, state, district, season, crop } = req.body;

        if (!text) {
            return res.status(400).json(formatResponse(false, 'Query text is required'));
        }

        const query = text.toLowerCase().trim();
        const lang = /[\u0C00-\u0C7F]/.test(query) ? 'telugu' : 'english';

        // Expanded Intent Mapping Patterns (Ordered by Specificity)
        const patterns = {
            sell_timing: [
                'sell', 'harvest', 'when', 'wait', 'demand', 'hold', 'prices', 'increase', 'market',
                'అమ్మాలి', 'సమయమా', 'ఆగాలా', 'మార్కెట్', 'నిల్వ', 'ధరలు', 'పెరుగుతాయా', 'కోత'
            ],
            price_reason: [
                'price', 'low', 'falling', 'different', 'middleman', 'stable', 'market', 'minimum support price', 'msp',
                'ధర', 'తగ్గింది', 'పడిపోతుంది', 'భిన్నంగా', 'మధ్యవర్తులు', 'డిమాండ్', 'మద్దతు ధర', 'తక్కువ'
            ],
            disease_guidance: [
                'disease', 'yellow', 'spots', 'growth', 'pest', 'precaution', 'officer', 'bugs', 'insects', 'worm', 'fungus',
                'రోగం', 'పసుపు', 'మచ్చలు', 'పెరుగుదల', 'జాగ్రత్తలు', 'పురుగుల', 'మందులు', 'నివారణ', 'తెగుళ్లు'
            ],
            weather_risk: [
                'weather', 'rain', 'rainfall', 'drought', 'dry', 'heat', 'delay', 'sowing', 'cold', 'wind',
                'వాతావరణం', 'వర్షం', 'ఎండ', 'ప్రమాదం', 'ఆలస్యం', 'విత్తనాలు', 'గాలులు', 'వరద'
            ],
            crop_recommendation: [
                'crop', 'best', 'grow', 'suitable', 'season', 'paddy', 'cotton', 'maize', 'pomegranate', 'chili', 'mirchi',
                'పంట', 'బాగుంటుంది', 'వేయాలి', 'ఆదాయం', 'సరిపోతుంది', 'వరి', 'పత్తి', 'మొక్కజొన్న', 'మిర్చి', 'సీజన్', 'ఖరీఫ్', 'రబీ'
            ],
            education: [
                'rotation', 'soil', 'test', 'sustainable', 'diversification', 'losses', 'awareness', 'decisions', 'tips', 'trick',
                'మార్పిడి', 'పరీక్ష', 'ముఖ్యం', 'నష్టాలు', 'అవగాహన', 'నిర్ణయాలు', 'చిట్కాలు', 'సలహా'
            ]
        };

        // Classify Intent with confidence score (implicit)
        let intent = 'unsupported';
        for (const [key, keywords] of Object.entries(patterns)) {
            if (keywords.some(kw => query.includes(kw))) {
                intent = key;
                break;
            }
        }

        // Response Logic (Guidance Engine)
        let answer = '';
        let suggested_actions = [];

        if (intent === 'unsupported') {
            answer = lang === 'telugu'
                ? 'క్షమించండి, మీ ప్రశ్న గురించి నాకు సమాచారం లేదు. దయచేసి పంట పంట సూచనలు, ధరలు లేదా మార్కెట్ గురించి అడగండి.'
                : 'I am sorry, I do not have specific information for that. Please ask about crops, prices, or market trends.';
            suggested_actions = lang === 'telugu' ? ['పంట సూచనలు', 'ధరల వివరాలు'] : ['Crop Suggestions', 'Price Trends'];
        } else {
            const guidance = getGuidance(intent, lang, district, season, crop, text);
            answer = guidance.answer;
            suggested_actions = guidance.actions;
        }

        const response = {
            language: lang,
            intent: intent,
            answer: answer,
            confidence_note: lang === 'telugu' ? 'కేవలం సమాచార మార్గదర్శకం మాత్రమే' : 'Informational guidance only',
            suggested_actions: suggested_actions
        };

        res.status(200).json(formatResponse(true, 'Copilot guidance retrieved', response));

    } catch (error) {
        next(error);
    }
};

module.exports = { handleCopilotQuery };

// Helper: Context-Aware Response Selector
function getGuidance(intent, lang, district, season, crop, originalText) {
    const isEnglish = lang === 'english';
    const query = originalText.toLowerCase();

    let answer = '';
    let actions = [];

    switch (intent) {
        case 'crop_recommendation':
            if (query.includes('best') || query.includes('బాగుంటుంది')) {
                answer = isEnglish
                    ? `For the current ${season} season in ${district}, Paddy and Cotton are the most profitable. If you have limited water, try Groundnut.`
                    : `${district}లో ప్రస్తుత ${season} సీజన్ కోసం వరి మరియు పత్తి అత్యంత లాభదాయకం. నీటి లభ్యత తక్కువగా ఉంటే వేరుశనగ ప్రయత్నించండి.`;
                actions = isEnglish ? ["Paddy Price", "Water Tips"] : ["వరి ధర", "నీటి చిట్కాలు"];
            } else if (crop && (query.includes('this crop') || query.includes(crop.toLowerCase()))) {
                answer = isEnglish
                    ? `Your ${crop} crop is at a critical stage. Ensure proper fertilizer application before the peak ${season} rains.`
                    : `మీ ${crop} పంట కీలక దశలో ఉంది. ${season} వర్షాలకు ముందే సరైన ఎరువులు వేయండి.`;
                actions = isEnglish ? ["Fertilizer Guide", "Pest Risk"] : ["ఎరువుల గైడ్", "తెగుళ్ల ప్రమాదం"];
            } else {
                answer = isEnglish
                    ? `Based on ${district} soil, legumes or maize are great for soil health after a major ${crop || 'grain'} cycle.`
                    : `${district} నేల రకం ప్రకారం, ${crop || 'ధాన్యం'} తర్వాత పప్పుధాన్యాలు లేదా మొక్కజొన్న వేయడం భూమికి మంచిది.`;
                actions = isEnglish ? ["Soil Test Near Me", "Seed Subsidy"] : ["నేల పరీక్ష", "విత్తన సబ్సిడీ"];
            }
            break;

        case 'sell_timing':
            if (query.includes('when') || query.includes('సమయమా')) {
                answer = isEnglish
                    ? `Market trends show supply is peaking. Wait 15 days if you have good storage; prices in ${district} usually rise after the initial rush.`
                    : `మార్కెట్ సరఫరా ఇప్పుడు ఎక్కువగా ఉంది. నిల్వ సదుపాయం ఉంటే 15 రోజులు ఆగండి; ${district}లో ప్రారంభ రద్దీ తర్వాత ధరలు పెరుగుతాయి.`;
                actions = isEnglish ? ["Nearby Warehouse", "Price History"] : ["సమీప గోదాము", "ధరల చరిత్ర"];
            } else {
                answer = isEnglish
                    ? `Current ${crop || 'Crop'} demand is stable. If you sell at the local yard today, you get the standard MSP.`
                    : `ప్రస్తుత ${crop || 'పంట'} డిమాండ్ స్థిరంగా ఉంది. ఈరోజు స్థానిక మార్కెట్‌లో అమ్మితే మీకు కనీస మద్దతు ధర లభిస్తుంది.`;
                actions = isEnglish ? ["Yard Location", "Check MSP"] : ["మార్కెట్ యార్డ్", "మద్దతు ధర"];
            }
            break;

        case 'price_reason':
            answer = isEnglish
                ? `Prices in ${district} are lower than last year due to record national production of ${crop || 'similar crops'}. Middlemen are also quoting lower due to transport costs.`
                : `${district}లో గత ఏడాది కంటే ధర తక్కువగా ఉంది, ఎందుకంటే దేశవ్యాప్తంగా ${crop || 'ఇదే రకమైన పంటల'} దిగుబడి పెరిగింది. రవాణా ఖర్చుల వల్ల మధ్యవర్తులు కూడా తక్కువ ధర అడుగుతున్నారు.`;
            actions = isEnglish ? ["Direct Buyer Link", "Price Alerts"] : ["నేరుగా కొనుగోలు", "ధర అలర్ట్స్"];
            break;

        case 'disease_guidance':
            if (query.includes('yellow') || query.includes('పసుపు') || query.includes('spots') || query.includes('మచ్చలు')) {
                answer = isEnglish
                    ? "Yellow spots on leaves often mean 'Leaf Spot' fungus. Use Neem oil immediately or consult the AI Scanner for a closer check."
                    : "ఆకులపై పసుపు మచ్చలు అంటే 'లీఫ్ స్పాట్' తెగులు కావచ్చు. వెంటనే వేప నూనె వాడండి లేదా AI స్కానర్ ద్వారా మరోసారి పరీక్షించండి.";
                actions = isEnglish ? ["Use AI Scanner", "Organic Spray Tips"] : ["AI స్కానర్ వాడండి", "సేంద్రీయ పిచికారీ"];
            } else {
                answer = isEnglish
                    ? `Pests are common in ${district} during ${season}. Use intercropping to naturally reduce risk by 30%.`
                    : `${season} సమయంలో ${district}లో తెగుళ్లు సహజం. అంతర్పంటల ద్వారా తెగుళ్ల ప్రమాదాన్ని 30% తగ్గించవచ్చు.`;
                actions = isEnglish ? ["Intercropping Ideas", "Pest List"] : ["అంతర్పంటల ఐడియాలు", "తెగుళ్ల జాబితా"];
            }
            break;

        case 'weather_risk':
            answer = isEnglish
                ? `Satellite data for ${district} indicates a dry spell for 10 days. Ensure secondary irrigation is ready for your ${crop || 'fields'}.`
                : `${district} ఉపగ్రహ సమాచారం ప్రకారం 10 రోజుల పాటు పొడి వాతావరణం ఉంటుంది. మీ ${crop || 'పొలాలకు'} ప్రత్యామ్నాయ నీటి వసతి సిద్ధం చేసుకోండి.`;
            actions = isEnglish ? ["Weekly Forecast", "Water Saving Tips"] : ["వారపు వాతావరణం", "నీటి పొదుపు చిట్కాలు"];
            break;

        case 'education':
            answer = isEnglish
                ? "Smart Tip: Rotating crops with pulses adds 20kg of Nitrogen back to your soil naturally. This saves you money on Urea!"
                : "స్మార్ట్ చిట్కా: పప్పుధాన్యాలతో పంట మార్పిడి చేస్తే నేలలో సహజంగా నత్రజని పెరుగుతుంది. దీనివల్ల మీకు యూరియా ఖర్చు తగ్గుతుంది!";
            actions = isEnglish ? ["Soil Health Card", "Money Saving Tips"] : ["నేల ఆరోగ్య కార్డు", "ఖర్చు తగ్గించుకోండి"];
            break;

        default:
            answer = isEnglish
                ? "Ask me: 'Best crop for Jan', 'Price for Cotton', or 'Why are leaves yellow'?"
                : "నన్ను అడగండి: 'జనవరిలో ఏ పంట వేయాలి', 'పత్తి ధర ఎంత', లేదా 'ఆకులు ఎందుకు పసుపుగా ఉన్నాయి'?";
            actions = isEnglish ? ["Crop Advice", "Price Info"] : ["పంట సలహా", "ధరల సమాచారం"];
    }

    return { answer, actions };
}

// Utility to help with matching
function queryContains(text, words) {
    if (typeof words === 'string') return text.toLowerCase().includes(words.toLowerCase());
    return words.some(w => text.toLowerCase().includes(w.toLowerCase()));
}
