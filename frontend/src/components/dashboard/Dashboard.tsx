import { motion } from 'framer-motion';
import { Leaf, Droplets, AlertTriangle, TrendingUp, Cpu, RefreshCw, Sparkles, ShieldAlert, IndianRupee, TrendingDown as LossIcon, ChevronRight } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { WeatherWidget } from './WeatherWidget';
import { AlertsPanel } from './AlertsPanel';
import { CropHealthCard } from './CropHealthCard';
import { FarmHealthPulse } from './FarmHealthPulse';
import { CropRecommendations } from './CropRecommendations';
import { CropLifecycle } from './CropLifecycle';
import { DecisionTrace } from '../intelligence/DecisionTrace';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIntelligence } from '@/hooks/useIntelligence';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/components/layout/Navigation';

interface DashboardProps {
  onNavigate: (nav: NavItem) => void;
}

// Mock data for demo
const mockCrops = [
  {
    cropName: 'Tomato Field A',
    status: 'healthy' as const,
    healthScore: 92,
    lastChecked: '2 hours ago',
    trend: 'up' as const,
  },
  {
    cropName: 'Rice Paddy',
    status: 'warning' as const,
    healthScore: 68,
    lastChecked: '1 day ago',
    trend: 'down' as const,
  },
  {
    cropName: 'Wheat Section',
    status: 'healthy' as const,
    healthScore: 85,
    lastChecked: '5 hours ago',
    trend: 'stable' as const,
  },
  {
    cropName: 'Corn Field B',
    status: 'critical' as const,
    healthScore: 45,
    lastChecked: '3 hours ago',
    trend: 'down' as const,
  },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  const { t } = useLanguage();
  const { intelligence } = useIntelligence();

  const farmerDataString = localStorage.getItem('farmerData');
  const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;
  const district = farmerData?.district || 'Guntur';

  return (
    <div className="p-4 md:p-6 space-y-12 max-w-[1600px] mx-auto pb-20">
      {/* 1. Header & Welcome Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/90 to-emerald-600 p-10 text-primary-foreground shadow-2xl"
      >
        {/* Decorative AI visual elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/20 blur-[120px] rounded-full" />
          <div className="absolute inset-0 ai-pattern" />
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          <div className="space-y-4">
            <Badge className="bg-white/20 text-white backdrop-blur-md border-none px-4 py-1.5 font-black text-xs tracking-[0.2em] uppercase">
              {t('intel.impactStory').split(' ')[0]} Intelligence Hub
            </Badge>
            <h1 className="text-5xl font-black leading-tight tracking-tighter">
              {t('dashboard.welcomeTitle')}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed font-medium">
              {t('dashboard.welcomeDesc')}
            </p>
          </div>
          {farmerData && (
            <div className="flex items-center gap-6 bg-black/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-inner">
              <div className="text-right">
                <p className="text-xs uppercase font-bold opacity-60 tracking-widest mb-1">{t('farmer.district')} {t('nav.insights')}</p>
                <p className="text-2xl font-black">{district}</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 text-white shadow-lg border border-white/20">
                <ShieldAlert className="h-8 w-8" />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* 2. Top Stats Overlay Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title={t('stats.totalCrops')}
          value={12}
          subtitle={t('stats.acrossFields')}
          icon={Leaf}
          variant="success"
          delay={0}
        />
        <StatsCard
          title={t('market.currentPrice')}
          value="₹2,450"
          icon={TrendingUp}
          trend={{ value: 12, isPositive: true }}
          variant="success"
          delay={0.1}
        />
        <StatsCard
          title={t('stats.waterSaved')}
          value="2,450L"
          subtitle={t('stats.thisMonth')}
          icon={Droplets}
          variant="info"
          delay={0.2}
        />
        <StatsCard
          title={t('stats.activeAlerts')}
          value={4}
          subtitle={`2 ${t('stats.critical')}`}
          icon={AlertTriangle}
          variant="warning"
          delay={0.3}
        />
      </div>

      {/* 3. Core Intelligence Row */}
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <FarmHealthPulse
            healthScore={intelligence.decisionScore}
            previousScore={intelligence.decisionScore - 5}
            reasons={intelligence.scoreReasons}
          />
          <DecisionTrace />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="border-emerald-500/30 bg-emerald-500/5 shadow-xl relative overflow-hidden group h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-inner group-hover:scale-110 transition-transform">
                      <IndianRupee className="h-10 w-10" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">{t('intel.lossPrevention')}</p>
                      <p className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₹{intelligence.lossAvoided.toLocaleString()}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {t('dashboard.welcomeDesc').split('.')[0]}. Calculated based on regional security standards and optimal harvest timing.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-emerald-500/10 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-600/40 tracking-widest">Efficiency Rating</span>
                  <Badge className="bg-emerald-500/20 text-emerald-600 border-none px-3">EXCELLENT</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <Card className={cn("shadow-xl border relative overflow-hidden group", intelligence.failureRisk === 'High' ? 'border-red-500/30 bg-red-500/5' : 'border-primary/20 bg-primary/5')}>
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={cn("p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform", intelligence.failureRisk === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary')}>
                    <ShieldAlert className="h-10 w-10" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-60">{t('intel.failureWarning')}</p>
                    <div className="flex items-center gap-3">
                      <p className="text-2xl font-black">{intelligence.failureRisk} Risk</p>
                      <div className={cn("h-3 w-3 rounded-full animate-ping", intelligence.failureRisk === 'High' ? 'bg-red-500' : 'bg-primary')} />
                    </div>
                  </div>
                </div>
                <p className="text-lg font-bold text-foreground/80 mb-4 leading-tight">{intelligence.failureReason}</p>
                <div className="mt-4 pt-6 border-t border-border/50 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                  <span>{t('scanner.confidence')}: 88%</span>
                  <span className="text-primary italic">Live Sensor Data</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 4. Operations Area (Recommendations & Health Status) */}
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-primary/5 pb-4">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4 text-gradient">
              <Sparkles className="text-primary h-8 w-8" />
              {t('dashboard.recommendations')}
            </h2>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-primary/20 text-primary px-4 py-1.5 uppercase text-xs font-black tracking-widest">Kharif Strategy</Badge>
            </div>
          </div>
          <CropRecommendations />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-primary/5 pb-4">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-4 text-gradient">
              <Leaf className="text-primary h-8 w-8" />
              {t('dashboard.cropHealth')}
            </h2>
            <button
              onClick={() => onNavigate('disease')}
              className="text-sm font-black text-primary hover:text-emerald-500 transition-colors uppercase tracking-widest flex items-center gap-2"
            >
              {t('dashboard.scanNew')} <TrendingUp className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCrops.map((crop, index) => (
              <CropHealthCard
                key={crop.cropName}
                {...crop}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. REDESIGNED: Full-Width Horizontal Utility Stacks */}
      <div className="space-y-10">
        <div className="flex items-center justify-between border-b-2 border-primary/5 pb-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-4xl font-black tracking-tighter uppercase text-primary/90">{t('intel.liveUtilities')}</h2>
            <p className="text-base text-muted-foreground font-medium">Full-spectrum farm monitoring and intelligence flows</p>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-primary/10 text-primary px-6 py-3 rounded-2xl font-black text-xs tracking-widest">
            <Cpu className="h-4 w-4" />
            EDGE COMPUTE ACTIVE
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Utility Row 1: Weather - Full Width */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glassmorphism rounded-[2.5rem] border-primary/10 hover:border-primary/30 transition-all overflow-hidden relative group">
              <div className="flex flex-col lg:flex-row items-stretch">
                <div className="lg:w-72 bg-primary/5 p-8 flex flex-col justify-center border-r border-primary/5 group-hover:bg-primary/10 transition-colors">
                  <div className="p-4 rounded-3xl bg-white dark:bg-card shadow-lg text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Droplets className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-2">{t('dashboard.todayWeather')}</h3>
                  <p className="text-xs text-muted-foreground font-bold">{t('weather.desc').split('.')[0]}</p>
                </div>
                <div className="flex-1 p-8 overflow-hidden">
                  <div className="max-w-5xl mx-auto">
                    <WeatherWidget />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Utility Row 2: Lifecycle - Full Width */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glassmorphism rounded-[2.5rem] border-primary/10 hover:border-primary/30 transition-all overflow-hidden relative group">
              <div className="flex flex-col lg:flex-row items-stretch">
                <div className="lg:w-72 bg-primary/5 p-8 flex flex-col justify-center border-r border-primary/5 group-hover:bg-primary/10 transition-colors">
                  <div className="p-4 rounded-3xl bg-white dark:bg-card shadow-lg text-primary w-fit mb-4 group-hover:scale-110 transition-transform">
                    <TrendingUp className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-2">Growth Lifecycle</h3>
                  <p className="text-xs text-muted-foreground font-bold">Real-time physiological progress tracking</p>
                </div>
                <div className="flex-1 p-8 flex items-center justify-center">
                  <div className="w-full max-w-4xl scale-110">
                    <CropLifecycle />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Utility Row 3: Rotation Advisor & Insights - Combined Horizontal */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-amber-500/5 border-amber-500/20 rounded-[2.5rem] border-2 hover:bg-amber-500/10 transition-all overflow-hidden group">
              <div className="flex flex-col lg:flex-row items-stretch min-h-[180px]">
                <div className="lg:w-72 bg-amber-500/5 p-8 flex flex-col justify-center border-r border-amber-500/10">
                  <div className="p-4 rounded-3xl bg-white dark:bg-card shadow-lg text-amber-500 w-fit mb-4 animate-spin-slow">
                    <RefreshCw className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-2">{t('intel.rotationAdvisor')}</h3>
                </div>
                <div className="flex-1 p-10 flex flex-col justify-center relative">
                  <RefreshCw className="absolute -right-12 -bottom-12 h-64 w-64 text-amber-500/5 group-hover:rotate-180 transition-transform duration-1000" />
                  <p className="text-2xl font-black italic text-foreground/90 max-w-4xl relative z-10 leading-relaxed">
                    "Soil fatigue alert: Since your last crop was <span className="text-amber-600 underline decoration-wavy underline-offset-4">{farmerData?.cropType || 'Rice'}</span>, rotate to <span className="text-emerald-600">Pulses</span> for nitrogen restoration."
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-black text-amber-600 tracking-widest uppercase relative z-10">
                    <span className="flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full"><ShieldAlert className="h-4 w-4" /> RESTORES 15% SOIL NITROGEN</span>
                    <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full"><TrendingUp className="h-4 w-4" /> INCREASES NEXT YIELD BY 20%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Utility Row 4: Alerts - Full Width Content Stretches */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glassmorphism rounded-[2.5rem] border-red-500/10 hover:border-red-500/30 transition-all overflow-hidden relative group">
              <div className="flex flex-col lg:flex-row items-stretch">
                <div className="lg:w-72 bg-red-500/5 p-8 flex flex-col justify-center border-r border-red-500/5 group-hover:bg-red-500/10 transition-colors">
                  <div className="p-4 rounded-3xl bg-white dark:bg-card shadow-lg text-red-500 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-10 w-10" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-widest leading-none mb-2">{t('alerts.title')}</h3>
                  <p className="text-xs text-muted-foreground font-bold">Real-time risk mitigation feed</p>
                </div>
                <div className="flex-1 p-8">
                  <div className="max-w-6xl mx-auto">
                    <AlertsPanel />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* 6. Impact & Social Story Footer */}
      <div className="pt-12 border-t-2 border-dashed border-primary/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative group cursor-pointer"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-neon-blue rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white dark:bg-card p-12 rounded-[2.5rem] border border-primary/10 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
            <div className="h-32 w-32 rounded-full border-4 border-primary/30 flex items-center justify-center p-2 bg-background overflow-hidden shrink-0 shadow-[0_0_50px_rgba(34,197,94,0.2)]">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=FarmerJohn" alt="Farmer" className="rounded-full" />
            </div>
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1">{t('intel.impactStory').toUpperCase()}</Badge>
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <p className="text-3xl font-black italic leading-tight text-foreground/90 tracking-tight">
                "Farmers in the {district} block averaged ₹45,000+ per acre more this season just by following our AI-driven optimal sowing windows."
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-black uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                <span>View Full District Impact Report</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
            <div className="hidden xl:flex flex-col items-center justify-center p-10 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner">
              <p className="text-xs font-black text-primary/60 uppercase tracking-widest mb-2 whitespace-nowrap">Average Profit Share</p>
              <p className="text-5xl font-black text-primary">+31.4%</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
