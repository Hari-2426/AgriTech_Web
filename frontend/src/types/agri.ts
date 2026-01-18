// AgriAssist Types

export type HealthStatus = 'healthy' | 'warning' | 'critical';

export interface CropHealth {
  id: string;
  cropName: string;
  status: HealthStatus;
  healthScore: number;
  lastChecked: Date;
  imageUrl?: string;
}

export interface DiseaseAnalysis {
  diseaseName: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  symptoms: string[];
  treatment: string[];
  preventiveMeasures: string[];
  recommendedProducts: {
    name: string;
    type: 'fertilizer' | 'pesticide' | 'fungicide';
    dosage: string;
  }[];
}

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
    uv: number;
    feelsLike: number;
  };
  hourly: {
    time: string;
    temp: number;
    condition: string;
    icon: string;
    precipChance: number;
  }[];
  daily: {
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipChance: number;
  }[];
}

export interface IrrigationData {
  soilMoisture: number; // 0-100
  recommendedWater: number; // liters
  nextIrrigationTime: string;
  waterSavingsPercent: number;
  schedule: {
    day: string;
    time: string;
    amount: number;
    status: 'completed' | 'scheduled' | 'skipped';
  }[];
}

export interface Alert {
  id: string;
  type: 'disease' | 'weather' | 'irrigation' | 'pest';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface FarmStats {
  totalCrops: number;
  healthyCrops: number;
  alertsCount: number;
  waterSaved: number;
}

export type CropType = 
  | 'rice'
  | 'wheat'
  | 'tomato'
  | 'potato'
  | 'corn'
  | 'cotton'
  | 'sugarcane'
  | 'chili'
  | 'onion'
  | 'groundnut'
  | 'soybean'
  | 'other';

export const CROP_OPTIONS: { value: CropType; label: string; icon: string }[] = [
  { value: 'rice', label: 'Rice', icon: '🌾' },
  { value: 'wheat', label: 'Wheat', icon: '🌾' },
  { value: 'tomato', label: 'Tomato', icon: '🍅' },
  { value: 'potato', label: 'Potato', icon: '🥔' },
  { value: 'corn', label: 'Corn', icon: '🌽' },
  { value: 'cotton', label: 'Cotton', icon: '☁️' },
  { value: 'sugarcane', label: 'Sugarcane', icon: '🎋' },
  { value: 'chili', label: 'Chili', icon: '🌶️' },
  { value: 'onion', label: 'Onion', icon: '🧅' },
  { value: 'groundnut', label: 'Groundnut', icon: '🥜' },
  { value: 'soybean', label: 'Soybean', icon: '🫘' },
  { value: 'other', label: 'Other', icon: '🌱' },
];
