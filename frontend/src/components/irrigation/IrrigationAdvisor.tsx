import { motion } from 'framer-motion';
import { Droplets, Calendar, TrendingDown, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useIrrigation } from '@/hooks/useIrrigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function IrrigationAdvisor() {
  const { irrigation, loading } = useIrrigation();
  const { t } = useLanguage();

  if (loading || !irrigation) {
    return <div className="space-y-8 animate-pulse">
      <div className="h-48 bg-muted/50 rounded-[2rem]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-64 bg-muted/50 rounded-[2rem]" />
        <div className="h-64 bg-muted/50 rounded-[2rem]" />
        <div className="h-64 bg-muted/50 rounded-[2rem]" />
      </div>
    </div>;
  }

  const moistureStatus = irrigation.soilMoisture < 30 ? 'low' : irrigation.soilMoisture < 60 ? 'optimal' : 'high';

  const getMoistureLabel = () => {
    if (moistureStatus === 'low') return t('irrigation.low');
    if (moistureStatus === 'optimal') return t('irrigation.optimal');
    return t('irrigation.high');
  };

  const getMoistureBadge = () => {
    if (moistureStatus === 'low') return t('irrigation.needsWater');
    if (moistureStatus === 'optimal') return t('irrigation.optimal');
    return t('irrigation.wellHydrated');
  };

  const getStatusLabel = (status: string) => {
    if (status === 'completed') return t('irrigation.completed');
    if (status === 'skipped') return t('irrigation.skipped');
    return t('irrigation.scheduled');
  };

  const getDayLabel = (day: string) => {
    const dayMap: Record<string, string> = {
      'Mon': t('day.mon'),
      'Tue': t('day.tue'),
      'Wed': t('day.wed'),
      'Thu': t('day.thu'),
      'Fri': t('day.fri'),
      'Sat': t('day.sat'),
      'Sun': t('day.sun'),
    };
    return dayMap[day] || day;
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Droplets className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent uppercase tracking-tight">
              {t('irrigation.title')}
            </h1>
          </div>
          <p className="text-muted-foreground font-medium text-lg">{t('irrigation.desc')}</p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Soil Moisture Gauge */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="p-8 text-center rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all h-full flex flex-col items-center justify-center">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8">{t('irrigation.soilMoisture')}</h3>
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="84" stroke="currentColor" strokeWidth="16" fill="none" className="text-muted/30" />
                <motion.circle
                  cx="96" cy="96" r="84"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeLinecap="round"
                  className={cn(
                    moistureStatus === 'low' ? 'text-red-500' :
                      moistureStatus === 'optimal' ? 'text-emerald-500' : 'text-blue-500'
                  )}
                  initial={{ strokeDasharray: '0 527' }}
                  animate={{ strokeDasharray: `${irrigation.soilMoisture * 5.27} 527` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter">{irrigation.soilMoisture}%</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 opacity-60">{getMoistureLabel()}</span>
              </div>
            </div>
            <Badge className={cn(
              "px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg",
              moistureStatus === 'low' ? 'bg-red-500 shadow-red-500/20' :
                moistureStatus === 'optimal' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'
            )}>
              {getMoistureBadge()}
            </Badge>
          </Card>
        </motion.div>

        {/* Water Recommendation */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <Card className="p-8 bg-gradient-to-br from-blue-600 to-sky-500 text-white border-none shadow-xl rounded-[2.5rem] h-full flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-8 flex items-center gap-3">
              <Droplets className="h-5 w-5" />
              {t('irrigation.recommended')}
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center py-6">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full" />
                <p className="text-7xl font-black tracking-tighter relative z-10">
                  {irrigation.recommendedWater}<span className="text-3xl ml-1">L</span>
                </p>
              </motion.div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mt-4">{t('irrigation.perCycle')}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center gap-3 mt-auto">
              <Clock className="h-4 w-4 opacity-80" />
              <span className="text-xs font-black uppercase tracking-widest">{t('irrigation.next')}: {irrigation.nextIrrigationTime}</span>
            </div>
          </Card>
        </motion.div>

        {/* Water Savings */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <Card className="p-8 rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              {t('irrigation.savings')}
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-emerald-600">
              <p className="text-7xl font-black tracking-tighter">
                {irrigation.waterSavingsPercent}<span className="text-3xl ml-1">%</span>
              </p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-4">{t('irrigation.compared')}</p>
            </div>
            <div className="mt-auto pt-6">
              <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Efficiency</span>
                <span className="text-xs font-black text-emerald-600">{irrigation.waterSavingsPercent}%</span>
              </div>
              <Progress value={irrigation.waterSavingsPercent} className="h-3 rounded-full bg-emerald-500/10 shadow-inner" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Daily Water Requirements (Bar Chart) */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-8 rounded-[2.5rem] border-none shadow-xl">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-blue-500" />
                {t('irrigation.dailyWaterRequirements')}
              </h3>
              <p className="text-muted-foreground font-medium text-sm">{t('irrigation.dailyWaterRequirementsDesc')}</p>
            </div>
            <Badge variant="outline" className="h-10 px-6 rounded-xl font-black uppercase tracking-widest text-[9px] border-blue-500/20 text-blue-600 bg-blue-500/5">
              {t('irrigation.unitLiters')}
            </Badge>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={irrigation.schedule.map((d) => ({
                  day: getDayLabel(d.day),
                  amount: d.amount,
                  status: d.status,
                }))}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="8 8" stroke="hsl(var(--muted)/0.3)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }}
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 800 }}
                  axisLine={false}
                  tickLine={false}
                  width={40}
                />
                <Tooltip
                  cursor={{ fill: 'transparent' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-card/95 backdrop-blur-md border-2 border-primary/20 p-5 rounded-2xl shadow-2xl">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">{label}</p>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Droplets className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-2xl font-black tracking-tight">{payload[0].value} L</p>
                              <p className={cn("text-[9px] font-black uppercase tracking-widest",
                                data.status === 'completed' ? 'text-emerald-500' :
                                  data.status === 'skipped' ? 'text-red-500' : 'text-blue-500'
                              )}>{getStatusLabel(data.status)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={40} isAnimationActive>
                  {irrigation.schedule.map((d, idx) => (
                    <Cell
                      key={idx}
                      className="transition-all duration-300 hover:opacity-80"
                      fill={
                        d.status === 'completed'
                          ? 'hsl(var(--primary))'
                          : d.status === 'skipped'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(59, 130, 246, 0.4)'
                      }
                      stroke={
                        d.status === 'completed' ? 'transparent' :
                          d.status === 'skipped' ? '#ef4444' : '#3b82f6'
                      }
                      strokeWidth={d.status === 'completed' ? 0 : 2}
                      strokeDasharray={d.status === 'completed' ? "0" : "5 5"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 group">
              <div className="h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/20 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('irrigation.legendCompleted')}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="h-4 w-4 rounded-full border-2 border-dashed border-blue-500 bg-blue-500/10 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('irrigation.legendScheduled')}</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="h-4 w-4 rounded-full border-2 border-dashed border-red-500 bg-red-500/10 group-hover:scale-125 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t('irrigation.legendSkipped')}</span>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
