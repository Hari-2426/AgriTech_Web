import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  IndianRupee,
  Wheat,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROP_OPTIONS, CropType } from '@/types/agri';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useIntelligence } from '@/hooks/useIntelligence';
import { Badge } from '@/components/ui/badge';

interface CropMarketData {
  crop: CropType;
  avgYield: number; // quintals per acre
  currentPrice: number; // ₹ per quintal
  priceChange: number; // percentage
  historicalPrices: { month: string; price: number }[];
  yieldTrend: { year: string; yield: number }[];
  aiPrediction: {
    predictedPrice: number;
    confidence: number;
    bestSellWindow: string;
  };
}

const MOCK_MARKET_DATA: Record<CropType, CropMarketData> = {
  rice: {
    crop: 'rice',
    avgYield: 25,
    currentPrice: 2150,
    priceChange: 5.2,
    historicalPrices: [
      { month: 'Jan', price: 1950 },
      { month: 'Feb', price: 1980 },
      { month: 'Mar', price: 2020 },
      { month: 'Apr', price: 2080 },
      { month: 'May', price: 2100 },
      { month: 'Jun', price: 2150 }
    ],
    yieldTrend: [
      { year: '2020', yield: 22 },
      { year: '2021', yield: 23 },
      { year: '2022', yield: 24 },
      { year: '2023', yield: 25 },
      { year: '2024', yield: 26 }
    ],
    aiPrediction: {
      predictedPrice: 2280,
      confidence: 78,
      bestSellWindow: 'June 15-25'
    }
  },
  wheat: {
    crop: 'wheat',
    avgYield: 20,
    currentPrice: 2275,
    priceChange: 3.8,
    historicalPrices: [
      { month: 'Jan', price: 2100 },
      { month: 'Feb', price: 2120 },
      { month: 'Mar', price: 2180 },
      { month: 'Apr', price: 2200 },
      { month: 'May', price: 2250 },
      { month: 'Jun', price: 2275 }
    ],
    yieldTrend: [
      { year: '2020', yield: 18 },
      { year: '2021', yield: 19 },
      { year: '2022', yield: 19 },
      { year: '2023', yield: 20 },
      { year: '2024', yield: 21 }
    ],
    aiPrediction: {
      predictedPrice: 2350,
      confidence: 82,
      bestSellWindow: 'July 1-10'
    }
  },
  tomato: {
    crop: 'tomato',
    avgYield: 150,
    currentPrice: 2800,
    priceChange: -8.5,
    historicalPrices: [
      { month: 'Jan', price: 3500 },
      { month: 'Feb', price: 3200 },
      { month: 'Mar', price: 2900 },
      { month: 'Apr', price: 2600 },
      { month: 'May', price: 3000 },
      { month: 'Jun', price: 2800 }
    ],
    yieldTrend: [
      { year: '2020', yield: 140 },
      { year: '2021', yield: 145 },
      { year: '2022', yield: 148 },
      { year: '2023', yield: 150 },
      { year: '2024', yield: 155 }
    ],
    aiPrediction: {
      predictedPrice: 3200,
      confidence: 65,
      bestSellWindow: 'August 5-15'
    }
  },
  potato: {
    crop: 'potato',
    avgYield: 120,
    currentPrice: 1200,
    priceChange: 2.1,
    historicalPrices: [
      { month: 'Jan', price: 1100 },
      { month: 'Feb', price: 1150 },
      { month: 'Mar', price: 1180 },
      { month: 'Apr', price: 1160 },
      { month: 'May', price: 1190 },
      { month: 'Jun', price: 1200 }
    ],
    yieldTrend: [
      { year: '2020', yield: 110 },
      { year: '2021', yield: 115 },
      { year: '2022', yield: 118 },
      { year: '2023', yield: 120 },
      { year: '2024', yield: 122 }
    ],
    aiPrediction: {
      predictedPrice: 1280,
      confidence: 75,
      bestSellWindow: 'March 1-10'
    }
  },
  corn: {
    crop: 'corn',
    avgYield: 30,
    currentPrice: 1950,
    priceChange: 4.5,
    historicalPrices: [
      { month: 'Jan', price: 1800 },
      { month: 'Feb', price: 1850 },
      { month: 'Mar', price: 1880 },
      { month: 'Apr', price: 1900 },
      { month: 'May', price: 1920 },
      { month: 'Jun', price: 1950 }
    ],
    yieldTrend: [
      { year: '2020', yield: 27 },
      { year: '2021', yield: 28 },
      { year: '2022', yield: 29 },
      { year: '2023', yield: 30 },
      { year: '2024', yield: 31 }
    ],
    aiPrediction: {
      predictedPrice: 2050,
      confidence: 80,
      bestSellWindow: 'September 20-30'
    }
  },
  cotton: {
    crop: 'cotton',
    avgYield: 8,
    currentPrice: 6500,
    priceChange: 6.8,
    historicalPrices: [
      { month: 'Jan', price: 5800 },
      { month: 'Feb', price: 5900 },
      { month: 'Mar', price: 6100 },
      { month: 'Apr', price: 6200 },
      { month: 'May', price: 6350 },
      { month: 'Jun', price: 6500 }
    ],
    yieldTrend: [
      { year: '2020', yield: 7 },
      { year: '2021', yield: 7.5 },
      { year: '2022', yield: 7.8 },
      { year: '2023', yield: 8 },
      { year: '2024', yield: 8.2 }
    ],
    aiPrediction: {
      predictedPrice: 6850,
      confidence: 72,
      bestSellWindow: 'November 10-20'
    }
  },
  sugarcane: {
    crop: 'sugarcane',
    avgYield: 350,
    currentPrice: 315,
    priceChange: 1.8,
    historicalPrices: [
      { month: 'Jan', price: 300 },
      { month: 'Feb', price: 305 },
      { month: 'Mar', price: 308 },
      { month: 'Apr', price: 310 },
      { month: 'May', price: 312 },
      { month: 'Jun', price: 315 }
    ],
    yieldTrend: [
      { year: '2020', yield: 320 },
      { year: '2021', yield: 330 },
      { year: '2022', yield: 340 },
      { year: '2023', yield: 350 },
      { year: '2024', yield: 360 }
    ],
    aiPrediction: {
      predictedPrice: 325,
      confidence: 85,
      bestSellWindow: 'December 1-15'
    }
  },
  chili: {
    crop: 'chili',
    avgYield: 35,
    currentPrice: 12000,
    priceChange: -12.5,
    historicalPrices: [
      { month: 'Jan', price: 15000 },
      { month: 'Feb', price: 14000 },
      { month: 'Mar', price: 13000 },
      { month: 'Apr', price: 12500 },
      { month: 'May', price: 12200 },
      { month: 'Jun', price: 12000 }
    ],
    yieldTrend: [
      { year: '2020', yield: 30 },
      { year: '2021', yield: 32 },
      { year: '2022', yield: 33 },
      { year: '2023', yield: 35 },
      { year: '2024', yield: 36 }
    ],
    aiPrediction: {
      predictedPrice: 14500,
      confidence: 60,
      bestSellWindow: 'February 15-28'
    }
  },
  onion: {
    crop: 'onion',
    avgYield: 100,
    currentPrice: 1800,
    priceChange: 15.2,
    historicalPrices: [
      { month: 'Jan', price: 1200 },
      { month: 'Feb', price: 1350 },
      { month: 'Mar', price: 1500 },
      { month: 'Apr', price: 1600 },
      { month: 'May', price: 1700 },
      { month: 'Jun', price: 1800 }
    ],
    yieldTrend: [
      { year: '2020', yield: 90 },
      { year: '2021', yield: 95 },
      { year: '2022', yield: 98 },
      { year: '2023', yield: 100 },
      { year: '2024', yield: 102 }
    ],
    aiPrediction: {
      predictedPrice: 2100,
      confidence: 68,
      bestSellWindow: 'October 5-15'
    }
  },
  groundnut: {
    crop: 'groundnut',
    avgYield: 15,
    currentPrice: 5800,
    priceChange: 4.2,
    historicalPrices: [
      { month: 'Jan', price: 5400 },
      { month: 'Feb', price: 5500 },
      { month: 'Mar', price: 5550 },
      { month: 'Apr', price: 5650 },
      { month: 'May', price: 5750 },
      { month: 'Jun', price: 5800 }
    ],
    yieldTrend: [
      { year: '2020', yield: 13 },
      { year: '2021', yield: 14 },
      { year: '2022', yield: 14.5 },
      { year: '2023', yield: 15 },
      { year: '2024', yield: 15.5 }
    ],
    aiPrediction: {
      predictedPrice: 6100,
      confidence: 76,
      bestSellWindow: 'November 1-10'
    }
  },
  soybean: {
    crop: 'soybean',
    avgYield: 12,
    currentPrice: 4200,
    priceChange: 3.5,
    historicalPrices: [
      { month: 'Jan', price: 3900 },
      { month: 'Feb', price: 3950 },
      { month: 'Mar', price: 4000 },
      { month: 'Apr', price: 4050 },
      { month: 'May', price: 4150 },
      { month: 'Jun', price: 4200 }
    ],
    yieldTrend: [
      { year: '2020', yield: 10 },
      { year: '2021', yield: 11 },
      { year: '2022', yield: 11.5 },
      { year: '2023', yield: 12 },
      { year: '2024', yield: 12.5 }
    ],
    aiPrediction: {
      predictedPrice: 4400,
      confidence: 79,
      bestSellWindow: 'October 15-25'
    }
  },
  other: {
    crop: 'other',
    avgYield: 20,
    currentPrice: 2000,
    priceChange: 2.0,
    historicalPrices: [
      { month: 'Jan', price: 1900 },
      { month: 'Feb', price: 1920 },
      { month: 'Mar', price: 1950 },
      { month: 'Apr', price: 1970 },
      { month: 'May', price: 1990 },
      { month: 'Jun', price: 2000 }
    ],
    yieldTrend: [
      { year: '2020', yield: 18 },
      { year: '2021', yield: 19 },
      { year: '2022', yield: 19.5 },
      { year: '2023', yield: 20 },
      { year: '2024', yield: 20.5 }
    ],
    aiPrediction: {
      predictedPrice: 2100,
      confidence: 70,
      bestSellWindow: 'Varies by crop'
    }
  }
};

export function YieldPriceInfo() {
  const { t } = useLanguage();
  const { intelligence } = useIntelligence();
  const [selectedCrop, setSelectedCrop] = useState<CropType>('rice');
  const data = MOCK_MARKET_DATA[selectedCrop];

  return (
    <div className="p-6 space-y-8 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2"
      >
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            {t('market.title')}
          </h1>
          <p className="text-muted-foreground text-lg mt-2">{t('market.subtitle')}</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{t('fertilizer.selectCrop')}</label>
          <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as CropType)}>
            <SelectTrigger className="w-64 h-12 text-lg font-bold border-primary/20 bg-background/50 backdrop-blur-sm shadow-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CROP_OPTIONS.map((crop) => (
                <SelectItem key={crop.value} value={crop.value}>
                  <span className="flex items-center gap-3 text-lg">
                    <span>{crop.icon}</span>
                    <span>{t(`crop.${crop.value}`)}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('market.avgYield'), value: data.avgYield, sub: 'quintals/acre', icon: Wheat, color: 'text-primary', bColor: 'border-primary/20' },
          { label: t('market.currentPrice'), value: `₹${data.currentPrice.toLocaleString()}`, sub: 'per quintal', icon: IndianRupee, color: 'text-emerald-500', bColor: 'border-emerald-500/20', trend: data.priceChange },
          { label: t('market.aiPrediction'), value: `₹${data.aiPrediction.predictedPrice.toLocaleString()}`, sub: `${data.aiPrediction.confidence}% ${t('scanner.confidence').toLowerCase()}`, icon: TrendingUp, color: 'text-blue-500', bColor: 'border-blue-500/20' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={cn("glassmorphism h-full group hover:shadow-2xl transition-all duration-500", stat.bColor)}>
              <CardContent className="pt-6 flex flex-col justify-between h-full">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                    <p className={cn("text-3xl font-black", stat.color)}>{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-muted-foreground font-medium">{stat.sub}</p>
                      {stat.trend !== undefined && (
                        <div className={cn("flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full", stat.trend >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600")}>
                          {stat.trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(stat.trend)}%
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={cn("p-4 rounded-2xl bg-muted/50 group-hover:scale-110 transition-transform duration-500", stat.color.replace('text-', 'bg-').replace('500', '500/10'))}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        {/* Sell Timing Special Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className={cn(
            "glassmorphism h-full border-2 shadow-lg transition-all duration-500",
            data.priceChange > 5 ? "border-emerald-500/40 bg-emerald-500/5" :
              data.priceChange > 0 ? "border-amber-500/40 bg-amber-500/5" :
                "border-red-500/40 bg-red-500/5"
          )}>
            <CardContent className="pt-6 flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{t('market.sentiment')}</p>
                  <div className="flex gap-1.5">
                    <div className={cn("h-2.5 w-2.5 rounded-full", data.priceChange <= 0 ? "bg-red-500 animate-pulse" : "bg-red-500/20")} />
                    <div className={cn("h-2.5 w-2.5 rounded-full", data.priceChange > 0 && data.priceChange <= 5 ? "bg-amber-500 animate-pulse" : "bg-amber-500/20")} />
                    <div className={cn("h-2.5 w-2.5 rounded-full", data.priceChange > 5 ? "bg-emerald-500 animate-pulse" : "bg-emerald-500/20")} />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className={cn(
                    "text-xl font-black tracking-tight",
                    data.priceChange > 5 ? "text-emerald-500 font-mono italic underline decoration-wavy" :
                      data.priceChange > 0 ? "text-amber-500" :
                        "text-red-500"
                  )}>
                    {data.priceChange > 5 ? t('market.bestSell') :
                      data.priceChange > 0 ? t('market.avgMarket') :
                        t('market.waitRebound')}
                  </h3>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                    {data.priceChange}% trend. {data.priceChange > 5 ? 'Supply is decreasing, prices peaking.' : 'High market saturation detected.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Intelligence Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent overflow-hidden relative group h-full shadow-lg">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
              <ShieldAlert className="h-32 w-32 text-amber-500" />
            </div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-amber-600 dark:text-amber-400 font-mono tracking-widest uppercase">
                <ShieldAlert className="h-4 w-4" />
                {t('market.priceShockIndicator')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-center gap-8">
                <div className="flex flex-col gap-2 p-3 bg-background/40 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
                  <div className={cn("h-5 w-5 rounded-full border-2 border-white/20", intelligence.priceShockRisk === 'High' ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" : "bg-red-500/10")} />
                  <div className={cn("h-5 w-5 rounded-full border-2 border-white/20", intelligence.priceShockRisk === 'Medium' ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" : "bg-amber-500/10")} />
                  <div className={cn("h-5 w-5 rounded-full border-2 border-white/20", intelligence.priceShockRisk === 'Low' ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" : "bg-emerald-500/10")} />
                </div>
                <div>
                  <p className="text-4xl font-black tracking-tighter text-foreground mb-1">
                    {intelligence.priceShockRisk === 'High' ? t('irrigation.high') : intelligence.priceShockRisk === 'Medium' ? t('weather.moderate') : t('irrigation.low')} <span className="text-muted-foreground font-thin uppercase">{t('alerts.title').slice(0, -1)}</span>
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm leading-relaxed font-medium">
                    {intelligence.priceShockRisk === 'High'
                      ? 'Critical supply-demand imbalance. Massive overproduction in neighboring blocks detected. Exit now recommended.'
                      : 'Market equilibrium stable. Normal volatility expected over the next 30-45 day window.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative group h-full shadow-lg">
            <div className="absolute right-0 top-0 p-8 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700">
              <Globe className="h-32 w-32 text-primary" />
            </div>
            <CardHeader className="pb-4 relative z-10">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-primary font-mono tracking-widest uppercase">
                <Globe className="h-4 w-4" />
                {t('market.districtComparison')}
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 flex flex-col justify-between h-[calc(100%-80px)]">
              <p className="text-lg font-bold leading-relaxed text-foreground/90 italic">
                "{intelligence.nearbyDistrictComparison}"
              </p>
              <div className="mt-6 flex items-center justify-between pt-6 border-t border-primary/10">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-3 py-1 font-black text-[10px] tracking-widest">{t('market.regionalAnalysis')}</Badge>
                <button className="text-xs font-black text-primary flex items-center gap-2 group/btn hover:translate-x-1 transition-transform uppercase">
                  {t('market.exploreNeighbor')} <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}>
          <Card className="glassmorphism overflow-hidden shadow-xl border-white/5">
            <CardHeader className="bg-muted/30 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    {t('market.priceHistory')}
                  </CardTitle>
                  <CardDescription className="ml-12">{t('market.last6Months')} revenue volatility</CardDescription>
                </div>
                <Badge variant="outline" className="font-mono">{selectedCrop.toUpperCase()}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.historicalPrices} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', padding: '12px' }}
                      formatter={(v: any) => [`₹${v.toLocaleString()}`, t('market.currentPrice')]}
                    />
                    <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="url(#priceGradient)" strokeWidth={4} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
          <Card className="glassmorphism overflow-hidden shadow-xl border-white/5">
            <CardHeader className="bg-muted/30 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    {t('market.yieldTrend')}
                  </CardTitle>
                  <CardDescription className="ml-12">{t('market.last5Years')} cumulative growth</CardDescription>
                </div>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 font-mono uppercase">GROWTH</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.yieldTrend} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                    <defs>
                      <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.1)" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} unit=" Q" />
                    <Tooltip
                      cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)', padding: '12px' }}
                      formatter={(v: any) => [`${v} quintals`, t('market.avgYield')]}
                    />
                    <Bar dataKey="yield" fill="url(#yieldGradient)" radius={[8, 8, 0, 0]} barSize={40} animationDuration={2000} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
