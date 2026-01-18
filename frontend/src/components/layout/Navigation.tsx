import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Scan,
  Droplets,
  Cloud,
  Leaf,
  FlaskConical,
  X,
  UserPlus,
  BookOpen,
  TrendingUp,
  BarChart3,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export type NavItem = 'dashboard' | 'disease' | 'irrigation' | 'weather' | 'fertilizer' | 'register' | 'insights' | 'guidance' | 'market' | 'demand' | 'login' | 'profile';

interface NavigationProps {
  activeNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  isMobileMenuOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
}

const navItems = [
  { id: 'dashboard' as const, labelKey: 'nav.dashboard', icon: LayoutDashboard, color: 'text-primary' },
  { id: 'disease' as const, labelKey: 'nav.cropScanner', icon: Scan, color: 'text-agri-leaf' },
  { id: 'guidance' as const, labelKey: 'nav.guidance', icon: BookOpen, color: 'text-warning' },
  { id: 'irrigation' as const, labelKey: 'nav.irrigation', icon: Droplets, color: 'text-agri-water' },
  { id: 'weather' as const, labelKey: 'nav.weather', icon: Cloud, color: 'text-agri-sky' },
  { id: 'fertilizer' as const, labelKey: 'nav.fertilizer', icon: FlaskConical, color: 'text-agri-earth' },
  { id: 'market' as const, labelKey: 'nav.market', icon: TrendingUp, color: 'text-neon-green' },
  { id: 'demand' as const, labelKey: 'nav.demand', icon: BarChart3, color: 'text-agri-water' },
  { id: 'insights' as const, labelKey: 'nav.insights', icon: BarChart3, color: 'text-neon-pink' },
];

export function Navigation({ activeNav, onNavChange, isMobileMenuOpen, onClose, isLoggedIn }: NavigationProps) {
  const { t } = useLanguage();

  const filteredNavItems = navItems.filter(item => {
    if (item.id === 'insights' && !isLoggedIn) return false;
    return true;
  });

  const handleNavClick = (nav: NavItem) => {
    onNavChange(nav);
    onClose();
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 flex-col border-r bg-card p-4 overflow-y-auto">
        <div className="space-y-2">
          {filteredNavItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                "hover:bg-accent hover:shadow-sm",
                activeNav === item.id
                  ? "bg-primary/10 text-primary shadow-sm border border-primary/20"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", activeNav === item.id ? item.color : "")} />
              <span className="font-medium">{t(item.labelKey)}</span>
              {activeNav === item.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto h-2 w-2 rounded-full bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>

      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r p-4 md:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-glow">
                    <Leaf className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">{t('app.name')}</h1>
                    <p className="text-xs text-muted-foreground">{t('app.tagline')}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                {filteredNavItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleNavClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                      "hover:bg-accent",
                      activeNav === item.id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", activeNav === item.id ? item.color : "")} />
                    <span className="font-medium">{t(item.labelKey)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
