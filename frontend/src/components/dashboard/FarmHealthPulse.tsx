import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Heart, TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface FarmHealthPulseProps {
  healthScore: number;
  previousScore?: number;
  reasons?: string[];
  onDetailsClick?: () => void;
}

export function FarmHealthPulse({ healthScore, previousScore = healthScore, reasons = [], onDetailsClick }: FarmHealthPulseProps) {
  const { t } = useLanguage();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const getDecisionStatus = () => {
    if (healthScore >= 80) return { status: 'Excellent', color: 'primary', pulse: 'health-pulse' };
    if (healthScore >= 60) return { status: 'Good', color: 'primary', pulse: 'health-pulse' };
    if (healthScore >= 40) return { status: 'Risky', color: 'warning', pulse: 'warning-pulse' };
    return { status: 'High Risk', color: 'destructive', pulse: 'critical-pulse' };
  };

  const { status, color, pulse } = getDecisionStatus();
  const trend = healthScore - previousScore;

  const healthBreakdown = [
    { label: t('health.soilHealth'), value: 85, color: 'bg-agri-earth' },
    { label: t('health.cropHealth'), value: healthScore, color: 'bg-primary' },
    { label: t('health.waterLevel'), value: 72, color: 'bg-agri-water' },
    { label: t('health.pestRisk'), value: 15, color: 'bg-destructive', inverted: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={cn(
          "relative overflow-hidden rounded-[2rem] p-8 cursor-pointer transition-all duration-300",
          "bg-white dark:bg-card border border-border/50 shadow-xl",
          "hover:shadow-glow"
        )}
        onClick={() => setShowBreakdown(!showBreakdown)}
      >
        <div className="absolute inset-0 ai-pattern opacity-10" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "p-3 rounded-2xl",
                color === 'primary' && "bg-primary/20 text-primary",
                color === 'warning' && "bg-warning/20 text-warning",
                color === 'destructive' && "bg-destructive/20 text-destructive"
              )}>
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tighter">{t('intel.decisionScore')}</h3>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Status: <span className={cn(
                "font-black uppercase tracking-widest text-xs",
                color === 'primary' && "text-primary",
                color === 'warning' && "text-warning",
                color === 'destructive' && "text-destructive"
              )}>{status}</span>
            </p>

            <div className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
              trend > 0 && "bg-primary/10 text-primary",
              trend < 0 && "bg-destructive/10 text-destructive",
              trend === 0 && "bg-muted text-muted-foreground"
            )}>
              {trend > 0 ? <TrendingUp className="h-3 w-3" /> :
                trend < 0 ? <TrendingDown className="h-3 w-3" /> :
                  <Minus className="h-3 w-3" />}
              <span>{trend > 0 ? '+' : ''}{trend}% {t('health.fromYesterday')}</span>
            </div>
          </div>

          <div className="relative mx-8">
            <motion.div className={cn("relative", pulse)}>
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" fill="none" className="text-muted/10" />
                <motion.circle
                  cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="10" fill="none" strokeLinecap="round"
                  className={cn(
                    color === 'primary' && "text-primary",
                    color === 'warning' && "text-warning",
                    color === 'destructive' && "text-destructive"
                  )}
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{ strokeDasharray: `${healthScore * 2.64} 264` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Heart className={cn(
                  "h-6 w-6 mb-0.5",
                  color === 'primary' && "text-primary",
                  color === 'warning' && "text-warning",
                  color === 'destructive' && "text-destructive"
                )} />
                <span className="text-3xl font-black">{healthScore}%</span>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col items-end gap-4">
            <motion.div animate={{ rotate: showBreakdown ? 180 : 0 }} className="p-3 rounded-2xl bg-muted/50">
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
            <button
              className="px-4 py-2 bg-primary/10 text-primary rounded-xl border border-primary/20 font-black text-xs tracking-widest hover:bg-primary/20 transition-all uppercase"
              onClick={(e) => { e.stopPropagation(); setShowBreakdown(!showBreakdown); }}
            >
              {t('intel.why')}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-8 mt-8 border-t border-border/50 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {healthBreakdown.map((item, index) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-muted-foreground">{item.label}</span>
                        <span className="text-foreground">{item.inverted ? 100 - item.value : item.value}%</span>
                      </div>
                      <div className="h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.inverted ? 100 - item.value : item.value}%` }}
                          className={cn("h-full rounded-full", item.color)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/30">
                  <h4 className="text-[10px] font-black text-primary mb-4 uppercase tracking-[0.2em]">{t('intel.decisionFactors')}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50 group hover:border-primary/30 transition-colors">
                        <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}