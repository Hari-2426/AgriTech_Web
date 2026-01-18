import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'info';
  delay?: number;
}

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-primary/5 border-primary/20',
  warning: 'bg-warning/5 border-warning/20',
  info: 'bg-accent border-accent-foreground/20',
};

const iconVariantStyles = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-primary/10 text-primary',
  warning: 'bg-warning/10 text-warning-foreground',
  info: 'bg-accent text-accent-foreground',
};

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "relative overflow-hidden rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <span className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          iconVariantStyles[variant]
        )}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
