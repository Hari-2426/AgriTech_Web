import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Users, 
  Building2,
  ShoppingCart,
  Star,
  Phone,
  IndianRupee,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Truck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROP_OPTIONS, CropType } from '@/types/agri';
import { cn } from '@/lib/utils';

interface DemandRegion {
  id: string;
  name: string;
  state: string;
  demandLevel: 'high' | 'medium' | 'low';
  priceMultiplier: number;
  shortage: boolean;
  crops: CropType[];
}

interface Buyer {
  id: string;
  name: string;
  type: 'market' | 'bulk' | 'consumer' | 'exporter';
  location: string;
  trustScore: number;
  preferredCrops: CropType[];
  priceRange: { min: number; max: number };
  contactAvailable: boolean;
  verified: boolean;
}

const DEMAND_REGIONS: DemandRegion[] = [
  {
    id: '1',
    name: 'Delhi NCR',
    state: 'Delhi',
    demandLevel: 'high',
    priceMultiplier: 1.25,
    shortage: true,
    crops: ['tomato', 'onion', 'potato']
  },
  {
    id: '2',
    name: 'Mumbai Metro',
    state: 'Maharashtra',
    demandLevel: 'high',
    priceMultiplier: 1.20,
    shortage: true,
    crops: ['rice', 'wheat', 'onion']
  },
  {
    id: '3',
    name: 'Bangalore Urban',
    state: 'Karnataka',
    demandLevel: 'medium',
    priceMultiplier: 1.15,
    shortage: false,
    crops: ['tomato', 'chili', 'corn']
  },
  {
    id: '4',
    name: 'Chennai Metro',
    state: 'Tamil Nadu',
    demandLevel: 'high',
    priceMultiplier: 1.18,
    shortage: true,
    crops: ['rice', 'groundnut', 'sugarcane']
  },
  {
    id: '5',
    name: 'Hyderabad',
    state: 'Telangana',
    demandLevel: 'medium',
    priceMultiplier: 1.12,
    shortage: false,
    crops: ['rice', 'chili', 'cotton']
  },
  {
    id: '6',
    name: 'Kolkata Metro',
    state: 'West Bengal',
    demandLevel: 'high',
    priceMultiplier: 1.22,
    shortage: true,
    crops: ['rice', 'potato', 'onion']
  }
];

const BUYERS: Buyer[] = [
  {
    id: '1',
    name: 'Reliance Fresh',
    type: 'bulk',
    location: 'Pan India',
    trustScore: 4.8,
    preferredCrops: ['tomato', 'potato', 'onion', 'rice'],
    priceRange: { min: 2000, max: 3500 },
    contactAvailable: true,
    verified: true
  },
  {
    id: '2',
    name: 'BigBasket Direct',
    type: 'bulk',
    location: 'Metro Cities',
    trustScore: 4.6,
    preferredCrops: ['tomato', 'onion', 'potato', 'corn'],
    priceRange: { min: 1800, max: 3200 },
    contactAvailable: true,
    verified: true
  },
  {
    id: '3',
    name: 'Azadpur Mandi',
    type: 'market',
    location: 'Delhi',
    trustScore: 4.2,
    preferredCrops: ['tomato', 'onion', 'potato', 'chili'],
    priceRange: { min: 1500, max: 4000 },
    contactAvailable: true,
    verified: true
  },
  {
    id: '4',
    name: 'Krishi Exports Ltd',
    type: 'exporter',
    location: 'Mumbai',
    trustScore: 4.5,
    preferredCrops: ['rice', 'groundnut', 'cotton', 'soybean'],
    priceRange: { min: 3000, max: 8000 },
    contactAvailable: true,
    verified: true
  },
  {
    id: '5',
    name: 'FarmFresh Co-op',
    type: 'consumer',
    location: 'Hyderabad',
    trustScore: 4.3,
    preferredCrops: ['rice', 'tomato', 'chili', 'onion'],
    priceRange: { min: 1600, max: 2800 },
    contactAvailable: false,
    verified: false
  },
  {
    id: '6',
    name: 'Kisan Market Hub',
    type: 'market',
    location: 'Bangalore',
    trustScore: 4.0,
    preferredCrops: ['tomato', 'corn', 'potato'],
    priceRange: { min: 1400, max: 3000 },
    contactAvailable: true,
    verified: true
  }
];

function TrustScore({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3 w-3",
            star <= Math.floor(score) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
          )}
        />
      ))}
      <span className="text-xs text-muted-foreground ml-1">{score.toFixed(1)}</span>
    </div>
  );
}

function BuyerTypeIcon({ type }: { type: Buyer['type'] }) {
  switch (type) {
    case 'market':
      return <ShoppingCart className="h-4 w-4" />;
    case 'bulk':
      return <Building2 className="h-4 w-4" />;
    case 'consumer':
      return <Users className="h-4 w-4" />;
    case 'exporter':
      return <Truck className="h-4 w-4" />;
  }
}

export function DemandSupply() {
  const { t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<CropType | 'all'>('all');

  const filteredRegions = selectedCrop === 'all' 
    ? DEMAND_REGIONS 
    : DEMAND_REGIONS.filter(r => r.crops.includes(selectedCrop));

  const filteredBuyers = selectedCrop === 'all'
    ? BUYERS
    : BUYERS.filter(b => b.preferredCrops.includes(selectedCrop));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-neon-green to-agri-leaf bg-clip-text text-transparent">
            {t('demand.title')}
          </h1>
          <p className="text-muted-foreground mt-1">{t('demand.subtitle')}</p>
        </div>
        <Select value={selectedCrop} onValueChange={(v) => setSelectedCrop(v as CropType | 'all')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by crop" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Crops</SelectItem>
            {CROP_OPTIONS.map((crop) => (
              <SelectItem key={crop.value} value={crop.value}>
                <span className="flex items-center gap-2">
                  <span>{crop.icon}</span>
                  <span>{crop.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Problem-Solution Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-destructive/10 via-warning/10 to-success/10 border-primary/20">
          <CardContent className="py-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
                <h3 className="font-semibold">{t('demand.problem')}</h3>
                <p className="text-sm text-muted-foreground">{t('demand.problemDesc')}</p>
              </div>
              <div className="space-y-2">
                <ArrowRight className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">{t('demand.solution')}</h3>
                <p className="text-sm text-muted-foreground">{t('demand.solutionDesc')}</p>
              </div>
              <div className="space-y-2">
                <CheckCircle2 className="h-8 w-8 text-success mx-auto" />
                <h3 className="font-semibold">{t('demand.impact')}</h3>
                <p className="text-sm text-muted-foreground">{t('demand.impactDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="demand" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="demand" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('demand.highDemandAreas')}
          </TabsTrigger>
          <TabsTrigger value="buyers" className="gap-2">
            <Users className="h-4 w-4" />
            {t('demand.potentialBuyers')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRegions.map((region, index) => (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "glassmorphism transition-all hover:shadow-lg",
                    region.shortage && "border-destructive/30 bg-destructive/5"
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className={cn(
                            "h-5 w-5",
                            region.demandLevel === 'high' ? 'text-destructive' : 
                            region.demandLevel === 'medium' ? 'text-warning' : 'text-muted-foreground'
                          )} />
                          <div>
                            <CardTitle className="text-lg">{region.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{region.state}</p>
                          </div>
                        </div>
                        {region.shortage && (
                          <Badge variant="destructive" className="animate-pulse">
                            Shortage
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('demand.demandLevel')}</span>
                          <Badge variant={
                            region.demandLevel === 'high' ? 'destructive' :
                            region.demandLevel === 'medium' ? 'secondary' : 'outline'
                          }>
                            {region.demandLevel.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('demand.priceBonus')}</span>
                          <span className="text-success font-semibold flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            +{((region.priceMultiplier - 1) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {region.crops.map((crop) => {
                            const cropInfo = CROP_OPTIONS.find(c => c.value === crop);
                            return (
                              <Badge key={crop} variant="outline" className="text-xs">
                                {cropInfo?.icon} {cropInfo?.label}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredBuyers.map((buyer, index) => (
                <motion.div
                  key={buyer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glassmorphism transition-all hover:shadow-lg hover:border-primary/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            buyer.type === 'bulk' ? 'bg-primary/10 text-primary' :
                            buyer.type === 'market' ? 'bg-warning/10 text-warning' :
                            buyer.type === 'exporter' ? 'bg-agri-water/10 text-agri-water' :
                            'bg-muted text-muted-foreground'
                          )}>
                            <BuyerTypeIcon type={buyer.type} />
                          </div>
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {buyer.name}
                              {buyer.verified && (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              )}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {buyer.location}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('demand.trustScore')}</span>
                          <TrustScore score={buyer.trustScore} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{t('demand.priceRange')}</span>
                          <span className="text-sm font-medium flex items-center">
                            <IndianRupee className="h-3 w-3" />
                            {buyer.priceRange.min.toLocaleString()} - {buyer.priceRange.max.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {buyer.preferredCrops.slice(0, 3).map((crop) => {
                            const cropInfo = CROP_OPTIONS.find(c => c.value === crop);
                            return (
                              <Badge key={crop} variant="outline" className="text-xs">
                                {cropInfo?.icon} {cropInfo?.label}
                              </Badge>
                            );
                          })}
                          {buyer.preferredCrops.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{buyer.preferredCrops.length - 3} more
                            </Badge>
                          )}
                        </div>
                        {buyer.contactAvailable && (
                          <Button size="sm" className="w-full mt-2 gap-2">
                            <Phone className="h-4 w-4" />
                            {t('demand.contactBuyer')}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
