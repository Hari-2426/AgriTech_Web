import { motion } from 'framer-motion';
import { Leaf, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { HealthStatus } from '@/types/agri';

interface CropHealthCardProps {
  cropName: string;
  status: HealthStatus;
  healthScore: number;
  lastChecked: string;
  imageUrl?: string;
  trend?: 'up' | 'down' | 'stable';
  delay?: number;
}

const TrendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

export function CropHealthCard({
  cropName,
  status,
  healthScore,
  lastChecked,
  imageUrl,
  trend = 'stable',
  delay = 0,
}: CropHealthCardProps) {
  const { t } = useLanguage();

  const statusConfig = {
    healthy: {
      label: t('health.healthy'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
      progressColor: 'bg-primary',
    },
    warning: {
      label: t('health.warning'),
      color: 'text-warning-foreground',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning/30',
      progressColor: 'bg-warning',
    },
    critical: {
      label: t('health.critical'),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
      progressColor: 'bg-destructive',
    },
  };

  const config = statusConfig[status];
  const TrendIconComponent = TrendIcon[trend];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 bg-card p-4 shadow-sm transition-all hover:shadow-lg cursor-pointer",
        config.borderColor
      )}
    >
      {/* Status indicator */}
      <div className={cn(
        "absolute top-0 right-0 px-3 py-1 rounded-bl-lg text-xs font-medium",
        config.bgColor,
        config.color
      )}>
        {config.label}
      </div>

      <div className="flex items-start gap-4">
        {/* Crop image/icon */}
        <div className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
          config.bgColor
        )}>
          {imageUrl ? (
            <img src={imageUrl} alt={cropName} className="h-10 w-10 object-cover rounded-lg" />
          ) : (
            <Leaf className={cn("h-7 w-7", config.color)} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-lg truncate">{cropName}</h4>
          <p className="text-xs text-muted-foreground mb-3">
            {t('health.lastChecked')}: {lastChecked}
          </p>

          {/* Health score progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('health.score')}</span>
              <div className="flex items-center gap-1">
                <span className={cn("text-lg font-bold", config.color)}>
                  {healthScore}%
                </span>
                <TrendIconComponent className={cn(
                  "h-4 w-4",
                  trend === 'up' ? 'text-primary' : 
                  trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                )} />
              </div>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ delay: delay + 0.2, duration: 0.6, ease: "easeOut" }}
                className={cn("h-full rounded-full", config.progressColor)}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
