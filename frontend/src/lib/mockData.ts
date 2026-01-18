export interface CropData {
  name: string;
  value: number;
}

export interface SeasonData {
  distribution: CropData[];
  profitability: CropData[];
}

export interface RegionalData {
  [season: string]: SeasonData;
}

export const AP_DISTRICTS = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna',
  'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam',
  'Vizianagaram', 'West Godavari', 'YSR Kadapa'
];

export const TELANGANA_DISTRICTS = [
  'Adilabad', 'Bhadradri Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon',
  'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar',
  'Khammam', 'Kumuram Bheem', 'Mahabubabad', 'Mahbubnagar', 'Mancherial',
  'Medak', 'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda',
  'Narayanpet', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rajanna Sircilla',
  'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad',
  'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
];

const DEFAULT_KHARIF: SeasonData = {
  distribution: [
    { name: 'Paddy', value: 40 },
    { name: 'Cotton', value: 25 },
    { name: 'Maize', value: 20 },
    { name: 'Chilli', value: 15 },
  ],
  profitability: [
    { name: 'Paddy', value: 42000 },
    { name: 'Cotton', value: 58000 },
    { name: 'Maize', value: 35000 },
    { name: 'Chilli', value: 85000 },
  ]
};

const DEFAULT_RABI: SeasonData = {
  distribution: [
    { name: 'Maize', value: 35 },
    { name: 'Black Gram', value: 25 },
    { name: 'Paddy', value: 25 },
    { name: 'Groundnut', value: 15 },
  ],
  profitability: [
    { name: 'Maize', value: 38000 },
    { name: 'Black Gram', value: 32000 },
    { name: 'Paddy', value: 44000 },
    { name: 'Groundnut', value: 40000 },
  ]
};

const DEFAULT_ZAID: SeasonData = {
  distribution: [
    { name: 'Vegetables', value: 50 },
    { name: 'Moong Dal', value: 30 },
    { name: 'Fodder', value: 20 },
  ],
  profitability: [
    { name: 'Vegetables', value: 48000 },
    { name: 'Moong Dal', value: 22000 },
    { name: 'Fodder', value: 15000 },
  ]
};

export const MOCK_CROP_INSIGHTS: Record<string, Record<string, RegionalData>> = {
  'Andhra Pradesh': {
    'Guntur': {
      'Kharif': DEFAULT_KHARIF,
      'Rabi': DEFAULT_RABI,
      'Zaid': DEFAULT_ZAID,
    }
  },
  'Telangana': {
    'Warangal': {
      'Kharif': DEFAULT_KHARIF,
      'Rabi': DEFAULT_RABI,
      'Zaid': DEFAULT_ZAID,
    }
  }
};

// Fallback for any other district
export const GET_INSIGHTS = (state: string, district: string, season: string): SeasonData => {
  const stateData = MOCK_CROP_INSIGHTS[state];
  if (stateData && stateData[district] && stateData[district][season]) {
    return stateData[district][season];
  }
  // Default fallback data
  if (season === 'Kharif') return DEFAULT_KHARIF;
  if (season === 'Rabi') return DEFAULT_RABI;
  return DEFAULT_ZAID;
};

export const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: '🚨 EXTREME WEATHER ALERT',
    message: 'Heavy rainfall (45mm+) predicted in your village between 2 PM - 6 PM today. Protect exposed crops!',
    type: 'weather',
    time: '30 mins ago',
    unread: true
  },
  {
    id: '2',
    title: '💰 MARKET PRICE SURGE',
    message: 'Chili prices in Guntur Yard spiked to ₹5,500. This is 15% above average. Best time to sell!',
    type: 'market',
    time: '2 hours ago',
    unread: true
  },
  {
    id: '3',
    title: '🦠 DISEASE RISK WARNING',
    message: 'Fall Armyworm reported in 3 neighboring farms. Apply preventive Neem spray within 24 hours.',
    type: 'advisory',
    time: '5 hours ago',
    unread: true
  },
  {
    id: '4',
    title: '💧 IRRIGATION ADVISORY',
    message: 'Soil moisture in Field A is below 20%. Automatic pumps scheduled for 4 AM tomorrow.',
    type: 'advisory',
    time: '1 day ago',
    unread: false
  }
];

export const MOCK_ANALYSIS_RESULT = {
  crop: 'Tomato',
  disease: 'Late Blight',
  confidence: 94,
  symptoms: [
    'Dark, water-soaked spots on leaves',
    'White fungal growth on leaf undersides',
    'Brown, firm lesions on fruit'
  ],
  precautions: [
    'Improve air circulation between plants',
    'Avoid overhead watering',
    'Remove and destroy infected plant parts'
  ],
  treatments: [
    'Apply copper-based fungicides',
    'Use resistant varieties in future plantings',
    'Rotate crops with non-solanaceous species'
  ]
};
