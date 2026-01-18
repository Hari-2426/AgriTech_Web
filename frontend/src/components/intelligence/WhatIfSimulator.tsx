import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, TrendingUp, ShieldAlert, IndianRupee, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CROP_OPTIONS, CropType } from '@/types/agri';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatIfSimulatorProps {
    isOpen: boolean;
    onClose: () => void;
    currentCrop: CropType;
}

export function WhatIfSimulator({ isOpen, onClose, currentCrop }: WhatIfSimulatorProps) {
    const { t } = useLanguage();
    const [selectedCrop, setSelectedCrop] = useState<CropType>(currentCrop);
    const [sellTiming, setSellTiming] = useState<'now' | 'later'>('now');
    const [isSimulating, setIsSimulating] = useState(false);
    const [result, setResult] = useState<{ profitDiff: number; riskChange: string; message: string } | null>(null);

    const handleSimulate = () => {
        setIsSimulating(true);
        // Simulated logic
        setTimeout(() => {
            let profitDiff = 0;
            let riskChange = 'Neutral';
            let message = '';

            if (selectedCrop !== currentCrop) {
                profitDiff = Math.floor(Math.random() * 15000 + 5000);
                riskChange = selectedCrop === 'tomato' ? 'Increased' : 'Decreased';
                message = `Switching to ${selectedCrop} shows higher potential profit but requires better irrigation management.`;
            } else if (sellTiming === 'later') {
                profitDiff = 4500;
                riskChange = 'Increased';
                message = 'Waiting 2 months for harvest might catch a price rebound, but storage risk increases by 15%.';
            } else {
                profitDiff = 0;
                message = 'Your current decision remains the safest baseline for this district.';
            }

            setResult({ profitDiff, riskChange, message });
            setIsSimulating(false);
        }, 1200);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-lg bg-card border-l border-primary/20 p-8 shadow-2xl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                                <div className="p-2 rounded-xl bg-primary/20 text-primary">
                                    <Play className="h-6 w-6 fill-primary" />
                                </div>
                                {t('intel.whatIf')}
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <Badge className="mb-8 bg-amber-500/10 text-amber-600 border-amber-500/20 font-black px-4 py-1 uppercase tracking-widest text-[10px]">
                            {t('intel.simulatorMode')}
                        </Badge>

                        <div className="space-y-8">
                            <Card className="bg-muted/30 border-dashed border-2">
                                <CardHeader className="p-6 pb-4">
                                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">{t('intel.scenarioConfig')}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 pt-0 space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('intel.simCrop')}</label>
                                        <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as CropType)}>
                                            <SelectTrigger className="h-12 font-bold bg-background/50 border-primary/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CROP_OPTIONS.map(c => (
                                                    <SelectItem key={c.value} value={c.value} className="font-bold">
                                                        <span className="flex items-center gap-2">
                                                            <span>{c.icon}</span>
                                                            <span>{t(`crop.${c.value}`)}</span>
                                                        </span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t('intel.sellStrategy')}</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant={sellTiming === 'now' ? 'default' : 'outline'}
                                                className={cn("h-12 font-bold uppercase text-[10px] tracking-widest", sellTiming === 'now' ? "bg-primary shadow-lg shadow-primary/30" : "border-primary/20")}
                                                onClick={() => setSellTiming('now')}
                                            >
                                                {t('intel.sellHarvest')}
                                            </Button>
                                            <Button
                                                variant={sellTiming === 'later' ? 'default' : 'outline'}
                                                className={cn("h-12 font-bold uppercase text-[10px] tracking-widest", sellTiming === 'later' ? "bg-primary shadow-lg shadow-primary/30" : "border-primary/20")}
                                                onClick={() => setSellTiming('later')}
                                            >
                                                {t('intel.delay2Months')}
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full h-14 mt-6 text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95" onClick={handleSimulate} disabled={isSimulating}>
                                        {isSimulating ? (
                                            <div className="flex items-center gap-3">
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {t('intel.simulating')}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Play className="h-4 w-4 fill-white" />
                                                {t('intel.runSimulation')}
                                            </div>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <div className="p-6 rounded-[2rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 shadow-inner">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('intel.simOutput')}</span>
                                            <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Profit Potential</p>
                                                <p className={`text-2xl font-black tracking-tight ${result.profitDiff >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                    {result.profitDiff >= 0 ? '+' : ''}₹{result.profitDiff.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Risk Shift</p>
                                                <p className={cn(
                                                    "text-sm font-black uppercase tracking-wider",
                                                    result.riskChange === 'Increased' ? 'text-amber-600' :
                                                        result.riskChange === 'Decreased' ? 'text-emerald-600' : 'text-muted-foreground'
                                                )}>
                                                    {result.riskChange}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 p-4 rounded-2xl bg-white/50 dark:bg-black/20 border border-white/50 dark:border-white/10 backdrop-blur-sm">
                                            <p className="text-xs text-muted-foreground font-bold leading-relaxed flex items-start gap-3">
                                                <HelpCircle className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                                                {result.message}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
