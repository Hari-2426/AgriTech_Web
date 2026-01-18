import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Shield, 
  Cloud, 
  Leaf,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Droplets,
  Sun,
  Bug,
  Sprout
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface GuidanceItem {
  id: string;
  title: string;
  description: string;
  tips: string[];
  icon: React.ReactNode;
  color: string;
}

const bestPractices: GuidanceItem[] = [
  {
    id: 'soil',
    title: 'Soil Preparation',
    description: 'Proper soil preparation is the foundation of a healthy crop.',
    tips: [
      'Test soil pH levels before planting (ideal: 6.0-7.0)',
      'Add organic matter like compost to improve soil structure',
      'Ensure proper drainage to prevent waterlogging',
      'Practice crop rotation to maintain soil fertility'
    ],
    icon: <Sprout className="h-6 w-6" />,
    color: 'text-amber-500'
  },
  {
    id: 'water',
    title: 'Water Management',
    description: 'Efficient irrigation ensures optimal crop growth.',
    tips: [
      'Use drip irrigation to reduce water waste by up to 60%',
      'Water early morning or late evening to reduce evaporation',
      'Monitor soil moisture levels regularly',
      'Mulch around plants to retain moisture'
    ],
    icon: <Droplets className="h-6 w-6" />,
    color: 'text-blue-500'
  },
  {
    id: 'sunlight',
    title: 'Sunlight & Spacing',
    description: 'Proper spacing ensures adequate sunlight for all plants.',
    tips: [
      'Follow recommended plant spacing for each crop',
      'Orient rows north-south for maximum sunlight',
      'Prune excess foliage for better air circulation',
      'Use shade nets during extreme summer'
    ],
    icon: <Sun className="h-6 w-6" />,
    color: 'text-yellow-500'
  }
];

const diseasePrevention: GuidanceItem[] = [
  {
    id: 'hygiene',
    title: 'Farm Hygiene',
    description: 'Cleanliness prevents disease spread.',
    tips: [
      'Remove and destroy infected plant parts immediately',
      'Sanitize tools between uses',
      'Keep farm surroundings clean and weed-free',
      'Dispose of crop residues properly'
    ],
    icon: <Shield className="h-6 w-6" />,
    color: 'text-green-500'
  },
  {
    id: 'pest',
    title: 'Pest Control',
    description: 'Integrated pest management for sustainable farming.',
    tips: [
      'Use pheromone traps for early pest detection',
      'Introduce beneficial insects like ladybugs',
      'Apply neem-based organic pesticides',
      'Rotate pesticides to prevent resistance'
    ],
    icon: <Bug className="h-6 w-6" />,
    color: 'text-red-500'
  },
  {
    id: 'resistant',
    title: 'Resistant Varieties',
    description: 'Choose disease-resistant crop varieties.',
    tips: [
      'Select certified disease-resistant seeds',
      'Consult local agricultural offices for recommendations',
      'Use treated seeds to prevent seed-borne diseases',
      'Maintain seed quality through proper storage'
    ],
    icon: <Leaf className="h-6 w-6" />,
    color: 'text-emerald-500'
  }
];

const climatePrecautions: GuidanceItem[] = [
  {
    id: 'monsoon',
    title: 'Monsoon Precautions',
    description: 'Protect crops during heavy rainfall.',
    tips: [
      'Create proper drainage channels before monsoon',
      'Use raised beds for vulnerable crops',
      'Apply preventive fungicides before rain',
      'Harvest ripe produce before heavy rains'
    ],
    icon: <Cloud className="h-6 w-6" />,
    color: 'text-blue-400'
  },
  {
    id: 'summer',
    title: 'Summer Care',
    description: 'Protect crops from extreme heat.',
    tips: [
      'Increase irrigation frequency during heat waves',
      'Use shade nets to reduce temperature by 3-5°C',
      'Apply mulch to keep soil cool',
      'Avoid mid-day farming activities'
    ],
    icon: <Sun className="h-6 w-6" />,
    color: 'text-orange-500'
  },
  {
    id: 'winter',
    title: 'Winter Protection',
    description: 'Shield crops from cold and frost.',
    tips: [
      'Use row covers to protect from frost',
      'Apply light irrigation on frost nights',
      'Choose cold-tolerant varieties for rabi season',
      'Time sowing to avoid extreme cold during critical stages'
    ],
    icon: <AlertTriangle className="h-6 w-6" />,
    color: 'text-cyan-500'
  }
];

function GuidanceCard({ item, index }: { item: GuidanceItem; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all hover:shadow-lg",
          "glassmorphism border-primary/10 hover:border-primary/30"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-background/50", item.color)}>
                {item.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{item.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </div>
        </CardHeader>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0">
                <div className="space-y-2 pt-4 border-t border-border/50">
                  {item.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export function CropGuidance() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">{t('guidance.expertAdvice')}</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-neon-green to-agri-leaf bg-clip-text text-transparent">
          {t('guidance.title')}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {t('guidance.subtitle')}
        </p>
      </motion.div>

      {/* Problem-Solution Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-r from-warning/10 via-primary/10 to-success/10 border-primary/20">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <AlertTriangle className="h-8 w-8 text-warning mx-auto" />
                <h3 className="font-semibold">{t('guidance.problem')}</h3>
                <p className="text-sm text-muted-foreground">{t('guidance.problemDesc')}</p>
              </div>
              <div className="space-y-2">
                <Lightbulb className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">{t('guidance.solution')}</h3>
                <p className="text-sm text-muted-foreground">{t('guidance.solutionDesc')}</p>
              </div>
              <div className="space-y-2">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
                <h3 className="font-semibold">{t('guidance.impact')}</h3>
                <p className="text-sm text-muted-foreground">{t('guidance.impactDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Guidance Tabs */}
      <Tabs defaultValue="practices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="practices" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('guidance.bestPractices')}</span>
          </TabsTrigger>
          <TabsTrigger value="disease" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">{t('guidance.diseasePrevention')}</span>
          </TabsTrigger>
          <TabsTrigger value="climate" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">{t('guidance.climatePrecautions')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practices" className="space-y-4">
          {bestPractices.map((item, index) => (
            <GuidanceCard key={item.id} item={item} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="disease" className="space-y-4">
          {diseasePrevention.map((item, index) => (
            <GuidanceCard key={item.id} item={item} index={index} />
          ))}
        </TabsContent>

        <TabsContent value="climate" className="space-y-4">
          {climatePrecautions.map((item, index) => (
            <GuidanceCard key={item.id} item={item} index={index} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
