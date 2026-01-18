import { motion } from 'framer-motion';
import { Droplets, Wind, Sun, ThermometerSun } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useWeather } from '@/hooks/useWeather';
import { useLanguage } from '@/contexts/LanguageContext';

export function WeatherWidget() {
  const { weather, loading } = useWeather();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="rounded-xl border bg-gradient-to-br from-agri-sky/10 to-agri-sky/5 p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border bg-gradient-to-br from-agri-sky/10 to-agri-sky/5 p-5 overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 text-8xl opacity-10">
        {weather.current.icon}
      </div>

      <div className="relative">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="text-5xl"
          >
            {weather.current.icon}
          </motion.div>
          <div>
            <p className="text-4xl font-bold">{weather.current.temp}°C</p>
            <p className="text-sm text-muted-foreground">{weather.current.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="h-4 w-4 text-agri-water" />
            <span className="text-muted-foreground">{t('weather.humidity')}:</span>
            <span className="font-medium">{weather.current.humidity}%</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{t('weather.wind')}:</span>
            <span className="font-medium">{weather.current.windSpeed} km/h</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ThermometerSun className="h-4 w-4 text-agri-sun" />
            <span className="text-muted-foreground">{t('weather.feelsLike')}:</span>
            <span className="font-medium">{weather.current.feelsLike}°C</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-agri-sun" />
            <span className="text-muted-foreground">{t('weather.uvIndex')}:</span>
            <span className="font-medium">{weather.current.uv}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
