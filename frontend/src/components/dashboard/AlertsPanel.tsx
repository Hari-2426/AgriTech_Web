import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Bug,
  Cloud,
  Droplets,
  X,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAlerts } from '@/hooks/useAlerts';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const alertIcons = {
  disease: Bug,
  weather: Cloud,
  irrigation: Droplets,
  pest: AlertTriangle,
};

const severityStyles = {
  info: 'border-l-agri-sky bg-agri-sky/5',
  warning: 'border-l-warning bg-warning/5',
  critical: 'border-l-destructive bg-destructive/5 animate-pulse-glow',
};

const severityBadgeStyles = {
  info: 'bg-agri-sky/10 text-agri-sky border-agri-sky/20',
  warning: 'bg-warning/10 text-warning-foreground border-warning/30',
  critical: 'bg-destructive/10 text-destructive border-destructive/20',
};

export function AlertsPanel() {
  const { alerts, loading, markAsRead, dismissAlert, markAllAsRead, unreadCount } = useAlerts();
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="rounded-[2rem] border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black uppercase tracking-widest">{t('alerts.title')}</h3>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[2rem] border bg-card p-6 shadow-xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <AlertTriangle className="h-24 w-24" />
      </div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black uppercase tracking-widest">{t('alerts.title')}</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-6 px-3 text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-destructive/20">
              {unreadCount} {t('alerts.new')}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-[10px] font-black uppercase tracking-widest hover:bg-primary/5 text-primary">
            <CheckCircle2 className="h-3 w-3 mr-1.5" />
            {t('alerts.markAllRead')}
          </Button>
        )}
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2 relative z-10">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 text-muted-foreground bg-primary/5 rounded-[2rem] border border-dashed border-primary/20"
            >
              <div className="h-16 w-16 bg-white dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <p className="font-bold text-sm">{t('alerts.allCaughtUp')}</p>
            </motion.div>
          ) : (
            alerts.map((alert) => {
              const Icon = alertIcons[alert.type];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                  onClick={() => markAsRead(alert.id)}
                  className={cn(
                    "relative rounded-[1.5rem] border-l-[6px] p-4 cursor-pointer transition-all hover:bg-muted/30 group",
                    severityStyles[alert.severity],
                    !alert.read && "ring-1 ring-primary/20 shadow-lg shadow-primary/5 bg-white dark:bg-card"
                  )}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissAlert(alert.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-sm",
                      alert.severity === 'critical' ? 'bg-red-500/10 text-red-500' :
                        alert.severity === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-sky-500/10 text-sky-500'
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="font-black text-sm truncate uppercase tracking-tight">{alert.title}</p>
                        {!alert.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge
                          variant="outline"
                          className={cn("text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full", severityBadgeStyles[alert.severity])}
                        >
                          {t(`severity.${alert.severity}`)}
                        </Badge>
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {alerts.length > 0 && (
        <Button variant="ghost" className="w-full mt-6 text-[11px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 h-12 rounded-2xl">
          {t('alerts.viewAll')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </motion.div>
  );
}
