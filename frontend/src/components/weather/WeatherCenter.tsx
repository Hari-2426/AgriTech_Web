import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, AlertTriangle, Thermometer, Calendar, Navigation2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWeather } from '@/hooks/useWeather';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export function WeatherCenter() {
  const { weather, loading } = useWeather();
  const { t, language } = useLanguage();

  const farmerDataString = localStorage.getItem('farmerData');
  const farmerData = farmerDataString ? JSON.parse(farmerDataString) : null;
  const district = farmerData?.district || 'Hyderabad';

  const currentDate = new Date().toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'te-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading || !weather) {
    return <div className="space-y-6 animate-pulse">
      <div className="h-64 bg-muted/50 rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-6">
        <div className="h-40 bg-muted/50 rounded-[2rem]" />
        <div className="h-40 bg-muted/50 rounded-[2rem]" />
      </div>
    </div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <Cloud className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-sky-500 bg-clip-text text-transparent uppercase tracking-tight">
              {t('weather.title')}
            </h1>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground font-bold">
            <Navigation2 className="h-4 w-4 fill-primary text-primary" />
            <span className="uppercase tracking-widest text-xs">{district}</span>
            <span className="opacity-20">|</span>
            <Calendar className="h-4 w-4" />
            <span className="uppercase tracking-widest text-xs">{currentDate}</span>
          </div>
        </div>
        <p className="text-muted-foreground font-medium max-w-md md:text-right leading-relaxed">{t('weather.desc')}</p>
      </motion.div>

      {/* Current Weather - Hero Card */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="p-8 bg-gradient-to-br from-sky-500 via-sky-400 to-primary text-white border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative group">
          <div className="absolute -right-12 -top-12 text-[15rem] leading-none opacity-20 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 select-none pointer-events-none">{weather.current.icon}</div>

          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div className="flex items-center gap-8">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="text-[100px] leading-none filter drop-shadow-2xl"
              >
                {weather.current.icon}
              </motion.div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-1">{t('weather.current')}</p>
                <h2 className="text-7xl font-black tracking-tighter mb-1">{weather.current.temp}°</h2>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <p className="text-lg font-black uppercase tracking-widest">{weather.current.condition}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 bg-white/10 backdrop-blur-md p-8 rounded-[2rem] border border-white/20">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Droplets className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t('weather.humidity')}</p>
                  <p className="text-xl font-black">{weather.current.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Wind className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t('weather.wind')}</p>
                  <p className="text-xl font-black">{weather.current.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Thermometer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t('weather.feelsLike')}</p>
                  <p className="text-xl font-black">{weather.current.feelsLike}°</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sun className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{t('weather.uvIndex')}</p>
                  <p className="text-xl font-black">{weather.current.uv}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Hourly Forecast */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="md:col-span-2">
          <Card className="p-8 rounded-[2rem] border-none shadow-xl h-full">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">{t('weather.hourly')}</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {weather.hourly.slice(0, 12).map((hour, i) => (
                <motion.div
                  key={hour.time}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex-shrink-0 text-center p-5 rounded-[1.5rem] bg-muted/30 border border-primary/5 min-w-[100px] hover:bg-primary/5 transition-colors group"
                >
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest group-hover:text-primary transition-colors">{hour.time}</p>
                  <p className="text-4xl my-4 group-hover:scale-110 transition-transform">{hour.icon}</p>
                  <p className="text-xl font-black">{hour.temp}°</p>
                  {hour.precipChance > 20 && (
                    <div className="flex items-center justify-center gap-1 mt-2 text-[10px] font-black text-sky-500">
                      <Droplets className="h-3 w-3" />
                      {hour.precipChance}%
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 7-Day Forecast */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-8 rounded-[2rem] border-none shadow-xl h-full">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">{t('weather.daily')}</h3>
            <div className="space-y-3">
              {weather.daily.map((day, i) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl transition-all group",
                    i === 0 ? "bg-primary text-white shadow-lg shadow-primary/30" : "hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3 w-28">
                    <span className="text-sm font-black uppercase tracking-tight">{i === 0 ? t('weather.today') : day.day}</span>
                  </div>
                  <span className="text-2xl group-hover:scale-110 transition-transform">{day.icon}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black">{day.high}°</span>
                    <span className={cn("text-sm font-bold opacity-60", i === 0 ? "text-white" : "text-muted-foreground")}>{day.low}°</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Weather Alerts */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-8 border-2 border-dashed border-amber-500/30 bg-amber-500/5 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <AlertTriangle className="h-32 w-32" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 mb-8 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5" />
            {t('weather.alerts')}
          </h3>
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-white dark:bg-black/20 border border-amber-500/10 shadow-sm transition-all hover:shadow-md group">
              <Badge variant="outline" className="mt-1 bg-amber-500/10 text-amber-600 border-amber-500/30 font-black uppercase tracking-widest text-[9px] px-3 py-1 group-hover:bg-amber-500 group-hover:text-white transition-colors">{t('weather.moderate')}</Badge>
              <div>
                <p className="font-black text-lg tracking-tight mb-1 group-hover:text-amber-600 transition-colors">{t('weather.highUV')}</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t('weather.highUVDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-5 p-6 rounded-3xl bg-white dark:bg-black/20 border border-sky-500/10 shadow-sm transition-all hover:shadow-md group">
              <Badge variant="outline" className="mt-1 bg-sky-500/10 text-sky-500 border-sky-500/30 font-black uppercase tracking-widest text-[9px] px-3 py-1 group-hover:bg-sky-500 group-hover:text-white transition-colors">{t('weather.info')}</Badge>
              <div>
                <p className="font-black text-lg tracking-tight mb-1 group-hover:text-sky-500 transition-colors">{t('weather.rainExpected')}</p>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{t('weather.rainExpectedDesc')}</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
