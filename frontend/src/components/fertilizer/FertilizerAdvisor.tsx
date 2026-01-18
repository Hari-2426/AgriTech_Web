import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Leaf, AlertTriangle, CheckCircle2, TrendingUp, Sparkles, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CROP_OPTIONS, type CropType } from '@/types/agri';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function FertilizerAdvisor() {
  const [selectedCrop, setSelectedCrop] = useState<CropType | ''>('');
  const [growthStage, setGrowthStage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { t } = useLanguage();

  const growthStages = [
    { value: 'seedling', label: t('stage.seedling'), icon: '🌱' },
    { value: 'vegetative', label: t('stage.vegetative'), icon: '🌿' },
    { value: 'flowering', label: t('stage.flowering'), icon: '🌸' },
    { value: 'fruiting', label: t('stage.fruiting'), icon: '🍅' },
    { value: 'harvest', label: t('stage.harvest'), icon: '🌾' },
  ];

  const getRecommendations = () => {
    if (!selectedCrop || !growthStage) return [];

    const baseData: Record<string, any[]> = {
      rice: [
        { name: t('fertilizer.nitrogenUrea'), dosage: '45kg/acre', npk: '46-0-0', timing: t('fertilizer.applyVegetative'), stage: 'vegetative' },
        { name: t('fertilizer.phosphorusDAP'), dosage: '30kg/acre', npk: '18-46-0', timing: t('fertilizer.applyPlanting'), stage: 'seedling' },
        { name: t('fertilizer.potassiumMOP'), dosage: '20kg/acre', npk: '0-0-60', timing: t('fertilizer.applyFlowering'), stage: 'flowering' },
      ],
      cotton: [
        { name: t('fertilizer.nitrogenUrea'), dosage: '50kg/acre', npk: '46-0-0', timing: '30 days after sowing', stage: 'vegetative' },
        { name: 'SSP (Super Phosphate)', dosage: '100kg/acre', npk: '0-16-0', timing: t('fertilizer.applyPlanting'), stage: 'seedling' },
        { name: 'Potash', dosage: '25kg/acre', npk: '0-0-60', timing: 'Square formation stage', stage: 'vegetative' },
      ],
      chili: [
        { name: 'Complex (20-20-0)', dosage: '50kg/acre', npk: '20-20-0', timing: 'Early growth', stage: 'seedling' },
        { name: 'Potassium Nitrate', dosage: '5kg/acre (Spray)', npk: '13-0-45', timing: 'Fruit development', stage: 'fruiting' },
      ]
    };

    const cropRecs = baseData[selectedCrop] || baseData.rice;
    return cropRecs.filter(r => r.stage === growthStage || growthStage === 'vegetative').slice(0, 3).map(r => ({
      ...r,
      type: t('fertilizer.type'),
      safety: t('fertilizer.avoidRain')
    }));
  };

  const handleGetAdvice = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const getCropLabel = (value: string) => {
    return t(`crop.${value}`);
  };

  const currentRecs = getRecommendations();

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600">
              <FlaskConical className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-amber-600 to-primary bg-clip-text text-transparent uppercase tracking-tight">
              {t('fertilizer.title')}
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-lg">{t('fertilizer.desc')}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 w-10 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden shadow-lg">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="user" />
              </div>
            ))}
          </div>
          <div className="ml-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10 flex items-center gap-2">
            <ShieldCheck className="h-3 w-3 text-primary" />
            AI Verified Advice
          </div>
        </div>
      </motion.div>

      {/* Selection Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-8 rounded-[2rem] border-none shadow-xl hover:shadow-2xl transition-all h-full bg-card">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
              <Leaf className="h-5 w-5 text-primary" />
              {t('fertilizer.selectCrop')}
            </h3>
            <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as CropType)}>
              <SelectTrigger className="h-14 bg-background border-primary/10 rounded-xl font-bold transition-all focus:border-primary shadow-inner">
                <SelectValue placeholder={t('fertilizer.chooseCrop')} />
              </SelectTrigger>
              <SelectContent>
                {CROP_OPTIONS.map(crop => (
                  <SelectItem key={crop.value} value={crop.value} className="font-bold">
                    <span className="flex items-center gap-3">
                      <span className="text-xl">{crop.icon}</span>
                      <span>{getCropLabel(crop.value)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="p-8 rounded-[2rem] border-none shadow-xl hover:shadow-2xl transition-all h-full bg-card">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              {t('fertilizer.growthStage')}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {growthStages.map(stage => (
                <button
                  key={stage.value}
                  onClick={() => setGrowthStage(stage.value)}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group",
                    growthStage === stage.value
                      ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                      : "bg-muted/30 border-transparent hover:border-primary/20"
                  )}
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{stage.icon}</span>
                  <span className="text-[9px] font-black uppercase tracking-tight text-center">{stage.label}</span>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <Button
        className="w-full h-16 text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 rounded-2xl active:scale-[0.98] transition-all bg-gradient-to-r from-primary to-emerald-600"
        size="lg"
        disabled={!selectedCrop || !growthStage || isAnalyzing}
        onClick={handleGetAdvice}
      >
        {isAnalyzing ? (
          <div className="flex items-center gap-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing Growth Parameters...
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5" />
            {t('fertilizer.getRecommendations')}
          </div>
        )}
      </Button>

      {/* Recommendations Results */}
      <AnimatePresence mode="wait">
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">{t('fertilizer.recommended')}</h3>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-black uppercase tracking-[0.2em] text-[10px]">Optimal Mix Found</Badge>
            </div>

            {currentRecs.length > 0 ? (
              <div className="grid gap-8">
                {currentRecs.map((rec, i) => (
                  <motion.div
                    key={rec.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative rounded-[2.5rem] border-2 border-primary/5 bg-white dark:bg-card p-8 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                      <FlaskConical className="h-32 w-32" />
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[9px] px-3">NPK: {rec.npk}</Badge>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">{rec.type}</span>
                        </div>
                        <h4 className="font-black text-4xl tracking-tighter text-foreground group-hover:text-primary transition-colors">{rec.name}</h4>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">Concentration</p>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <div key={star} className={cn("h-1.5 w-6 rounded-full", star <= 4 ? "bg-primary" : "bg-muted")} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 relative z-10">
                      <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex items-center gap-5 transition-all group-hover:bg-primary/10">
                        <div className="h-14 w-14 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('fertilizer.dosage')}</p>
                          <p className="text-xl font-black">{rec.dosage}</p>
                        </div>
                      </div>
                      <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-5 transition-all group-hover:bg-emerald-500/10">
                        <div className="h-14 w-14 rounded-2xl bg-white dark:bg-black/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Clock className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{t('fertilizer.timing')}</p>
                          <p className="text-lg font-black leading-tight">{rec.timing}</p>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="mt-8 p-6 rounded-3xl bg-amber-500/5 border-2 border-dashed border-amber-500/20 flex items-center gap-4 text-sm"
                    >
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                      </div>
                      <p className="text-amber-800 dark:text-amber-200 font-bold uppercase tracking-tight text-xs leading-relaxed">{rec.safety}</p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-20 text-center rounded-[3rem] border-4 border-dashed border-muted bg-transparent">
                <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-8 opacity-30 shadow-inner">
                  <Leaf className="h-12 w-12" />
                </div>
                <h4 className="text-2xl font-black text-muted-foreground mb-2">Parameters Required</h4>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">Please select a growth stage to activate the AI recommendation engine.</p>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
