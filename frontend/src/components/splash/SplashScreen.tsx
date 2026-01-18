import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Sprout, Sun, Droplets, Cpu, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const { t } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const [showAuthor, setShowAuthor] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const startedAtRef = useState(() => Date.now())[0];

  const quote = t('splash.quote');

  useEffect(() => {
    // Delay content reveal for dramatic effect
    const showTimer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showContent) return;

    setTypingDone(false);
    setShowAuthor(false);
    setTypedText('');

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index <= quote.length) {
        setTypedText(quote.slice(0, index));
        index++;
      } else {
        clearInterval(typeInterval);
        setTypingDone(true);
        setShowAuthor(true);
      }
    }, 32);

    return () => clearInterval(typeInterval);
  }, [quote, showContent]);

  useEffect(() => {
    if (!showContent) return;

    const minDurationMs = 5500;

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = Math.min(prev + 1, 100);

        // Only complete after:
        // 1) bar finished
        // 2) typing done
        // 3) minimum time elapsed
        const elapsed = Date.now() - startedAtRef;
        if (next >= 100 && typingDone && elapsed >= minDurationMs) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500);
          return 100;
        }

        return next;
      });
    }, 60);

    return () => clearInterval(progressInterval);
  }, [onComplete, showContent, startedAtRef, typingDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Dynamic Background with Farm + AI overlay */}
        <div className="absolute inset-0">
          {/* Base gradient */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20 dark:from-background dark:via-primary/5 dark:to-neon-green/10"
          />
          
          {/* AI Grid Pattern */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-0 grid-pattern"
          />
          
          {/* Animated AI Neural Network Lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.15 }}>
            <motion.path
              d="M0 50% Q 25% 30%, 50% 50% T 100% 50%"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            <motion.path
              d="M0 70% Q 35% 50%, 60% 70% T 100% 60%"
              stroke="hsl(var(--neon-blue))"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.3 }}
            />
          </svg>
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                scale: 0,
                opacity: 0
              }}
              animate={{ 
                y: [null, Math.random() * -100],
                scale: [0, Math.random() * 0.5 + 0.5],
                opacity: [0, 0.6, 0]
              }}
              transition={{ 
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
              className="absolute w-2 h-2 rounded-full bg-primary/40"
            />
          ))}
          
          {/* Glowing orbs */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.2, 0.4, 0.2],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2], 
              opacity: [0.15, 0.3, 0.15],
              x: [0, -15, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neon-blue/15 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute top-1/2 right-1/3 w-48 h-48 rounded-full bg-neon-green/20 blur-3xl"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <button
            type="button"
            onClick={onComplete}
            className="absolute -top-10 right-0 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('splash.skip')}
          </button>

          {/* Logo Animation with AI elements */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 150, 
              damping: 15,
              delay: 0.3 
            }}
            className="mb-8"
          >
            <div className="relative inline-flex items-center justify-center">
              {/* Outer rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <div className="w-40 h-40 rounded-full border border-dashed border-primary/40 dark:border-neon-green/40" />
              </motion.div>
              
              {/* Middle rotating ring - opposite direction */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute"
              >
                <div className="w-32 h-32 rounded-full border border-dotted border-neon-blue/30" />
              </motion.div>
              
              {/* Main logo with glow */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="relative h-24 w-24 rounded-full bg-gradient-to-br from-primary via-primary to-neon-green/80 dark:from-neon-green/90 dark:to-primary flex items-center justify-center shadow-2xl neon-glow"
              >
                <Sprout className="h-12 w-12 text-primary-foreground" />
                
                {/* Inner pulse ring */}
                <motion.div
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-primary/30"
                />
              </motion.div>
              
              {/* Orbiting icons */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48"
              >
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute top-0 left-1/2 -translate-x-1/2 p-2 rounded-full bg-agri-sun/20 backdrop-blur-sm"
                >
                  <Sun className="h-5 w-5 text-agri-sun" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 p-2 rounded-full bg-agri-water/20 backdrop-blur-sm"
                >
                  <Droplets className="h-5 w-5 text-agri-water" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/20 backdrop-blur-sm"
                >
                  <Leaf className="h-5 w-5 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neon-blue/20 backdrop-blur-sm"
                >
                  <Cpu className="h-5 w-5 text-neon-blue" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* App Name with zoom effect */}
          <motion.h1
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-2"
          >
            <span className="bg-gradient-to-r from-primary via-neon-green to-primary dark:from-neon-green dark:via-primary dark:to-neon-blue bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-2 mb-8"
          >
            <Activity className="h-4 w-4 text-neon-green animate-pulse" />
            <p className="text-lg text-muted-foreground">
              {t('app.tagline')}
            </p>
            <Activity className="h-4 w-4 text-neon-blue animate-pulse" />
          </motion.div>

          {/* Quote with Typing Effect */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
            transition={{ delay: 1 }}
            className="mb-8 min-h-[120px]"
          >
            <div className="relative px-4">
              <span className="text-5xl text-primary/30 absolute -top-2 -left-2">"</span>
              <p className="text-lg md:text-xl text-foreground/80 italic leading-relaxed px-6">
                {typedText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-primary ml-1 align-middle"
                />
              </p>
              <span className="text-5xl text-primary/30 absolute -bottom-6 -right-2">"</span>
            </div>
            
            <AnimatePresence>
              {showAuthor && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-muted-foreground mt-6"
                >
                  {t('splash.author')}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Futuristic Loading Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: showContent ? 1 : 0, scaleX: showContent ? 1 : 0 }}
            transition={{ delay: 1.2 }}
            className="w-72 mx-auto"
          >
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
              <span className="flex items-center gap-2">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Cpu className="h-4 w-4 text-primary" />
                </motion.div>
                {t('splash.loading')}
              </span>
              <span className="font-mono text-primary">{Math.round(loadingProgress)}%</span>
            </div>
            <div className="h-2 bg-muted/50 rounded-full overflow-hidden backdrop-blur-sm border border-border/50">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                className="h-full bg-gradient-to-r from-primary via-neon-green to-neon-blue rounded-full relative"
                transition={{ duration: 0.1 }}
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{ x: [-100, 300] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* AI Visualization Bars */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.5 }}
            className="flex justify-center items-end gap-1 mt-8 h-8"
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  scaleY: [0.3, 1, 0.3],
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-1.5 rounded-full bg-gradient-to-t from-primary/50 to-neon-green origin-bottom"
                style={{ height: `${12 + Math.random() * 20}px` }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}