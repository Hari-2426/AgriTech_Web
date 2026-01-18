import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Droplets, Shield, MapPin, Leaf, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WhatIfSimulator } from '../intelligence/WhatIfSimulator';
import { useState } from 'react';
import { HelpCircle, Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Recommendation {
    name: string;
    profit: string;
    risk: 'Low' | 'Medium' | 'High';
    water: string;
    soil: string;
    description: string;
    icon: string;
}

const REGIONAL_RECOMMENDATIONS: Record<string, Recommendation[]> = {
    'Andhra Pradesh': [
        {
            name: 'Chili',
            profit: '₹55,000',
            risk: 'Medium',
            water: 'Low-Medium',
            soil: 'Black & Red Soils',
            description: 'Expect high market demand in Guntur/Krishna region next season.',
            icon: '🌶️'
        },
        {
            name: 'Rice (BPT-5204)',
            profit: '₹28,000',
            risk: 'Low',
            water: 'High',
            soil: 'Alluvial',
            description: 'Stable yields expected due to favorable reservoir levels.',
            icon: '🌾'
        },
        {
            name: 'Cotton',
            profit: '₹42,000',
            risk: 'High',
            water: 'Moderate',
            soil: 'Black Soil',
            description: 'Price rebound likely. Best for well-drained fields.',
            icon: '☁️'
        }
    ],
    'Telangana': [
        {
            name: 'Maize',
            profit: '₹24,000',
            risk: 'Low',
            water: 'Medium',
            soil: 'Red Loamy',
            description: 'Ideal for Nizamabad & Warangal districts this Kharif.',
            icon: '🌽'
        },
        {
            name: 'Cotton',
            profit: '₹48,000',
            risk: 'High',
            water: 'Moderate',
            soil: 'Black Soil',
            description: 'Dominant crop for this region. Plan for pest management early.',
            icon: '☁️'
        },
        {
            name: 'Turmeric',
            profit: '₹65,000',
            risk: 'Medium',
            water: 'Medium',
            soil: 'Well-drained Loamy',
            description: 'Long-term investment with premium returns in export markets.',
            icon: '✨'
        }
    ]
};

export function CropRecommendations() {
    const { t } = useLanguage();
    const farmerDataString = localStorage.getItem('farmerData');
    const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;

    // Default to AP if no data found
    const state = farmerData?.state || 'Andhra Pradesh';
    const district = farmerData?.district || 'Guntur';
    const recommendations = REGIONAL_RECOMMENDATIONS[state] || REGIONAL_RECOMMENDATIONS['Andhra Pradesh'];

    const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
    const [explainingCrop, setExplainingCrop] = useState<string | null>(null);

    if (!farmerData) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        {t('intel.smartRecs')}
                    </h2>
                    <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {t('intel.optimizedFor')} {district}, {state}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-primary/30 text-primary hover:bg-primary/5 font-bold uppercase text-[10px]"
                        onClick={() => setIsSimulatorOpen(true)}
                    >
                        <Play className="h-3 w-3 fill-primary" />
                        {t('intel.whatIf')}
                    </Button>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-bold px-3">
                        Kharif 2026
                    </Badge>
                </div>
            </div>

            <WhatIfSimulator
                isOpen={isSimulatorOpen}
                onClose={() => setIsSimulatorOpen(false)}
                currentCrop={farmerData.cropType}
            />

            <div className="grid md:grid-cols-3 gap-4">
                {recommendations.map((crop, index) => (
                    <motion.div
                        key={crop.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="glassmorphism h-full group hover:border-primary/50 transition-all border-primary/10 overflow-hidden relative shadow-lg">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform">
                                <Leaf className="h-12 w-12" />
                            </div>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <span className="text-3xl mb-2">{crop.icon}</span>
                                    <Badge
                                        className={
                                            crop.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                                                crop.risk === 'Medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                                                    'bg-red-500/10 text-red-600 border-red-500/20'
                                        }
                                    >
                                        {crop.risk} Risk
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold">{crop.name}</CardTitle>
                                <CardDescription className="text-[10px] leading-tight line-clamp-2 font-medium">
                                    {crop.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                            <IndianRupee className="h-3 w-3" /> {t('intel.estProfit')}
                                        </span>
                                        <span className="font-black text-emerald-600 text-sm">{crop.profit}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                            <Droplets className="h-3 w-3" /> {t('irrigation.needsWater')}
                                        </span>
                                        <span className="font-bold">{crop.water}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-muted-foreground flex items-center gap-1 font-medium">
                                            <TrendingUp className="h-3 w-3" /> {t('health.soilHealth')}
                                        </span>
                                        <span className="font-bold">{crop.soil}</span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-border/30 mt-2">
                                    <button
                                        className="w-full text-[10px] font-black text-primary flex items-center justify-center gap-2 hover:bg-primary/5 py-1.5 rounded transition-colors uppercase tracking-widest"
                                        onClick={() => setExplainingCrop(explainingCrop === crop.name ? null : crop.name)}
                                    >
                                        <HelpCircle className="h-3 w-3" />
                                        {t('intel.whyChoice')}
                                    </button>
                                    <AnimatePresence>
                                        {explainingCrop === crop.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mt-2"
                                            >
                                                <div className="p-3 rounded-xl bg-primary/5 text-[10px] text-muted-foreground space-y-2 border border-primary/10">
                                                    <p className="flex items-center gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-primary" />
                                                        <strong>{t('common.season')}:</strong> Optimal for monsoon.
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-primary" />
                                                        <strong>{t('farmer.district')}:</strong> High success rate.
                                                    </p>
                                                    <p className="flex items-center gap-2">
                                                        <span className="h-1 w-1 rounded-full bg-primary" />
                                                        <strong>Market:</strong> Supply shortage predicted.
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
