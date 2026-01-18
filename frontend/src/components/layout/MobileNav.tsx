import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Scan,
  Droplets,
  Cloud,
  FlaskConical,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { NavItem } from './Navigation';

interface MobileNavProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  isLoggedIn: boolean;
}

const navItems = [
  { id: 'dashboard' as const, labelKey: 'nav.home', icon: LayoutDashboard },
  { id: 'insights' as const, labelKey: 'nav.insights', icon: BarChart3 },
  { id: 'disease' as const, labelKey: 'nav.scan', icon: Scan },
  { id: 'irrigation' as const, labelKey: 'nav.water', icon: Droplets },
  { id: 'weather' as const, labelKey: 'nav.weather', icon: Cloud },
];

export function MobileNav({ activeNav, onNavChange, isLoggedIn }: MobileNavProps) {
  const { t } = useLanguage();

  const filteredNavItems = navItems.filter(item => {
    if (item.id === 'insights' && !isLoggedIn) return false;
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t bg-card/95 backdrop-blur-md">
      <div className="flex items-center justify-around py-2 px-2 safe-area-inset-bottom">
        {filteredNavItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onNavChange(item.id)}
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-[60px]",
              activeNav === item.id
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <item.icon className={cn(
                "h-5 w-5 transition-all",
                activeNav === item.id && "scale-110"
              )} />
              {activeNav === item.id && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                />
              )}
            </div>
            <span className={cn(
              "text-xs font-medium",
              activeNav === item.id && "text-primary"
            )}>
              {t(item.labelKey)}
            </span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
}
