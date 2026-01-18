const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CropDisease = require('./src/models/CropDisease');
const RegionalData = require('./src/models/RegionalData');
const MarketData = require('./src/models/MarketData');
const AssistantQuery = require('./src/models/AssistantQuery');

dotenv.config();

const diseases = [
    {
        cropName: 'Tomato',
        diseaseName: 'Early Blight',
        symptoms: ['Small dark spots on older leaves', 'Target-like rings', 'Stem lesions'],
        remedies: ['Remove infected leaves', 'Apply copper-based fungicides', 'Improve air circulation'],
        prevention: ['Crop rotation', 'Mulching', 'Avoid overhead watering'],
        keywords: ['tomato', 'early', 'blight', 'spots'],
        severityRange: { min: 20, max: 70 }
    },
    {
        cropName: 'Potato',
        diseaseName: 'Late Blight',
        symptoms: ['Water-soaked spots on leaves', 'White mold on underside', 'Dark brown tubers'],
        remedies: ['Immediate removal of infected plants', 'Apply systemic fungicides'],
        prevention: ['Certified seed potatoes', 'Proper spacing', 'Quick disposal of cull piles'],
        keywords: ['potato', 'late', 'blight', 'mold'],
        severityRange: { min: 40, max: 95 }
    },
    {
        cropName: 'Cotton',
        diseaseName: 'Boll Rot',
        symptoms: ['Small circular brown spots on bolls', 'Bolls fail to open', 'Internal fiber decay'],
        remedies: ['Reduce humidity', 'Timed fungicide application'],
        prevention: ['Proper drainage', 'Insect control', 'Optimized plant density'],
        keywords: ['cotton', 'boll', 'rot', 'decay'],
        severityRange: { min: 30, max: 80 }
    },
    {
        cropName: 'Rice',
        diseaseName: 'Blast',
        symptoms: ['Spindle-shaped lesions with gray centers', 'Neck rot', 'Blast nodes'],
        remedies: ['Balance nitrogen usage', 'Apply Tricyclazole'],
        prevention: ['Resistant varieties', 'Seed treatment', 'Proper field water management'],
        keywords: ['rice', 'blast', 'lesions', 'neck'],
        severityRange: { min: 25, max: 90 }
    },
    {
        cropName: 'Chili',
        diseaseName: 'Leaf Curl',
        symptoms: ['Upward curling of leaves', 'Stunted growth', 'Smaller fruit size'],
        remedies: ['Control whitefly population', 'Neem oil spray'],
        prevention: ['Yellow sticky traps', 'Clean cultivation', 'Barrier crops'],
        keywords: ['chili', 'curl', 'stunted', 'whitefly'],
        severityRange: { min: 15, max: 60 }
    }
];

const regionalStats = [
    {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        dominantCrops: ['Chili', 'Cotton', 'Rice'],
        avgRainfall: '850mm',
        soilType: 'Black & Red Soils',
        seasons: [
            {
                name: 'Kharif',
                distribution: [
                    { name: 'Rice', value: 40 },
                    { name: 'Cotton', value: 35 },
                    { name: 'Chili', value: 20 },
                    { name: 'Others', value: 5 }
                ],
                profitability: [
                    { name: 'Rice', value: 28000 },
                    { name: 'Cotton', value: 42000 },
                    { name: 'Chili', value: 55000 },
                    { name: 'Others', value: 15000 }
                ]
            }
        ]
    },
    {
        state: 'Telangana',
        district: 'Warangal',
        dominantCrops: ['Cotton', 'Rice', 'Maize', 'Chili'],
        avgRainfall: '900mm',
        soilType: 'Red Loamy Soils',
        seasons: [
            {
                name: 'Kharif',
                distribution: [
                    { name: 'Cotton', value: 55 },
                    { name: 'Rice', value: 25 },
                    { name: 'Maize', value: 15 },
                    { name: 'Others', value: 5 }
                ],
                profitability: [
                    { name: 'Cotton', value: 45000 },
                    { name: 'Rice', value: 27000 },
                    { name: 'Maize', value: 21000 },
                    { name: 'Others', value: 12000 }
                ]
            }
        ]
    }
];

const marketInfo = [
    {
        cropName: 'Rice',
        currentPrice: 2150,
        previousPrice: 2050,
        priceChange: 4.87,
        sellStatus: 'Average',
        historicalPrices: [
            { month: 'Jan', price: 1950 }, { month: 'Feb', price: 1980 }, { month: 'Mar', price: 2020 },
            { month: 'Apr', price: 2050 }, { month: 'May', price: 2150 }
        ],
        yieldTrend: [
            { year: '2021', yieldValue: 22 }, { year: '2022', yieldValue: 24 }, { year: '2023', yieldValue: 25 }
        ]
    },
    {
        cropName: 'Chili',
        currentPrice: 12500,
        previousPrice: 11000,
        priceChange: 13.6,
        sellStatus: 'Best',
        historicalPrices: [
            { month: 'Jan', price: 14000 }, { month: 'Feb', price: 13000 }, { month: 'Mar', price: 11000 },
            { month: 'Apr', price: 10500 }, { month: 'May', price: 12500 }
        ],
        yieldTrend: [
            { year: '2021', yieldValue: 30 }, { year: '2022', yieldValue: 33 }, { year: '2023', yieldValue: 35 }
        ]
    },
    {
        cropName: 'Cotton',
        currentPrice: 6800,
        previousPrice: 7200,
        priceChange: -5.5,
        sellStatus: 'Wait',
        historicalPrices: [
            { month: 'Jan', price: 7500 }, { month: 'Feb', price: 7400 }, { month: 'Mar', price: 7200 },
            { month: 'Apr', price: 7000 }, { month: 'May', price: 6800 }
        ],
        yieldTrend: [
            { year: '2021', yieldValue: 7.5 }, { year: '2022', yieldValue: 8 }, { year: '2023', yieldValue: 8.2 }
        ]
    }
];

const assistantQueries = [
    {
        keywords: ['best crop', 'which crop', 'ఏ పంట'],
        response_en: 'Based on your district, Chili and Cotton are best for this season. Expect over ₹45,000 profit per acre.',
        response_te: 'ప్రస్తుత సీజన్‌కు మిర్చి మరియు పత్తి ఉత్తమమైనవి. ఇవి ఎకరాకు ₹45,000 పైగా లాభాన్ని అందిస్తాయి.',
        category: 'CropSelection'
    },
    {
        keywords: ['sell', 'market', 'అమ్ము'],
        response_en: 'It is the perfect time to sell! Market prices for your crop are currently trending up by 12%.',
        response_te: 'పంటను అమ్మడానికి ఇది సరైన సమయం! మార్కెట్ ధరలు ప్రస్తుతం 12% పెరుగుదలలో ఉన్నాయి.',
        category: 'Market'
    },
    {
        keywords: ['why low', 'price low', 'ధర తక్కువ'],
        response_en: 'Prices are low due to high supply from Guntur. I recommend waiting 10 days for a price rebound.',
        response_te: 'పక్క జిల్లాల్లో సరఫరా ఎక్కువగా ఉండటం వల్ల ధర తగ్గింది. మరో 10 రోజులు ఆగడం మంచిది.',
        category: 'Market'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB for seeding...');

        await CropDisease.deleteMany();
        await RegionalData.deleteMany();
        await MarketData.deleteMany();
        await AssistantQuery.deleteMany();

        await CropDisease.insertMany(diseases);
        await RegionalData.insertMany(regionalStats);
        await MarketData.insertMany(marketInfo);
        await AssistantQuery.insertMany(assistantQueries);

        console.log('Full Extended Knowledge Base Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seedDB();
