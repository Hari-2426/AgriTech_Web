import { motion } from 'framer-motion';
import { Camera, Droplets, Cloud, FlaskConical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NavItem } from '@/components/layout/Navigation';

interface QuickActionsProps {
  onNavigate: (nav: NavItem) => void;
}

const actions = [
  {
    id: 'disease' as const,
    labelKey: 'action.scanCrop',
    descKey: 'action.diseaseDetection',
    icon: Camera,
    color: 'from-primary to-primary/80',
  },
  {
    id: 'irrigation' as const,
    labelKey: 'action.checkWater',
    descKey: 'action.irrigationStatus',
    icon: Droplets,
    color: 'from-agri-water to-agri-sky',
  },
  {
    id: 'weather' as const,
    labelKey: 'nav.weather',
    descKey: 'action.forecastAlerts',
    icon: Cloud,
    color: 'from-agri-sky to-agri-sky/80',
  },
  {
    id: 'fertilizer' as const,
    labelKey: 'nav.fertilizer',
    descKey: 'action.recommendations',
    icon: FlaskConical,
    color: 'from-agri-earth to-agri-soil',
  },
];

export function QuickActions({ onNavigate }: QuickActionsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate(action.id)}
          className={cn(
            "relative overflow-hidden rounded-xl p-4 text-left transition-all",
            "bg-gradient-to-br",
            action.color,
            "text-white shadow-md hover:shadow-lg"
          )}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20" />
            <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/10" />
          </div>

          <div className="relative">
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg mb-3",
              "bg-white/20 backdrop-blur-sm"
            )}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold">{t(action.labelKey)}</h3>
            <p className="text-xs text-white/80">{t(action.descKey)}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
