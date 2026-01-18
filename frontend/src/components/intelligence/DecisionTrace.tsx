import { motion } from 'framer-motion';
import { History, Target, AlertCircle, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIntelligence } from '@/hooks/useIntelligence';
import { useLanguage } from '@/contexts/LanguageContext';

export function DecisionTrace() {
    const { intelligence } = useIntelligence();
    const { t } = useLanguage();

    const timeline = [
        { stage: t('action.recommendations'), value: 'Chickpea', icon: <Target className="h-3 w-3" />, color: 'bg-primary' },
        { stage: 'Your Choice', value: 'Tomato', icon: <History className="h-3 w-3" />, color: 'bg-amber-500' },
        { stage: 'Outcome', value: 'Low Profit', icon: <AlertCircle className="h-3 w-3" />, color: 'bg-destructive' },
        { stage: 'Learning', value: 'Diversify in Rabi', icon: <TrendingUp className="h-3 w-3" />, color: 'bg-emerald-500' },
    ];

    return (
        <Card className="overflow-hidden border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
                        <History className="h-4 w-4 text-primary" />
                        {t('intel.decisionTrace')}
                    </CardTitle>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20 px-3">
                        {t('intel.seasonAnalysis')}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                    <div className="space-y-1">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{t('intel.regretScore')}</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-primary">{intelligence.regretScore}</span>
                            <span className="text-xs text-muted-foreground">/ 100</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Tone</p>
                        <p className="text-xs font-medium text-primary italic">"Learning together"</p>
                    </div>
                </div>

                <div className="relative pt-6 pb-2 px-2">
                    <div className="absolute top-9 left-2 right-2 h-0.5 bg-border z-0" />
                    <div className="flex justify-between relative z-10">
                        {timeline.map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`h-6 w-6 rounded-full ${item.color} flex items-center justify-center text-white shadow-lg`}
                                >
                                    {item.icon}
                                </motion.div>
                                <div className="space-y-0.5">
                                    <p className="text-[8px] text-muted-foreground uppercase font-black">{item.stage}</p>
                                    <p className="text-[10px] font-black">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20 flex gap-3 group hover:bg-amber-500/10 transition-colors">
                    <div className="p-2 rounded bg-amber-500/10 text-amber-600 shrink-0">
                        <Info className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-amber-600 uppercase mb-1 underline decoration-amber-500/30">{t('intel.whatWrong')}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            {intelligence.regretMessage}
                        </p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('intel.learningIndex')}</span>
                        <span className="text-[10px] font-black text-primary">{intelligence.knowledgeProgress}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${intelligence.knowledgeProgress}%` }}
                            className="h-full bg-primary shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                        />
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-2 text-right font-medium italic">
                        {t('intel.learningImproved')}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
