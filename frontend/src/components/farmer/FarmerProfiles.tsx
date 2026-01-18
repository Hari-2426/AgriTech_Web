import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Leaf, 
  Scale, 
  Eye,
  Edit2,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sprout,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { CROP_OPTIONS, CropType } from '@/types/agri';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FarmerProfile {
  id: string;
  farmerId: string;
  name: string;
  village: string;
  mandal: string;
  district: string;
  cropType: CropType;
  cropQuantity: string;
  landSize: string;
  phone?: string;
  email?: string;
  totalYield?: number;
  soilStatus?: 'excellent' | 'good' | 'fair' | 'poor';
  registeredAt: string;
}

// Mock data for demo
const MOCK_FARMERS: FarmerProfile[] = [
  {
    id: '1',
    farmerId: 'AADHAAR-1234-5678',
    name: 'Ramesh Kumar',
    village: 'Kondapur',
    mandal: 'Serilingampally',
    district: 'Rangareddy',
    cropType: 'rice',
    cropQuantity: '150',
    landSize: '5',
    phone: '+91 98765 43210',
    email: 'ramesh@farmer.com',
    totalYield: 145,
    soilStatus: 'excellent',
    registeredAt: '2024-01-15'
  },
  {
    id: '2',
    farmerId: 'AADHAAR-2345-6789',
    name: 'Lakshmi Devi',
    village: 'Gachibowli',
    mandal: 'Serilingampally',
    district: 'Rangareddy',
    cropType: 'cotton',
    cropQuantity: '80',
    landSize: '8',
    phone: '+91 87654 32109',
    totalYield: 75,
    soilStatus: 'good',
    registeredAt: '2024-02-20'
  },
  {
    id: '3',
    farmerId: 'AADHAAR-3456-7890',
    name: 'Venkat Rao',
    village: 'Shamshabad',
    mandal: 'Rajendranagar',
    district: 'Rangareddy',
    cropType: 'tomato',
    cropQuantity: '200',
    landSize: '3',
    phone: '+91 76543 21098',
    email: 'venkat@farmer.com',
    totalYield: 180,
    soilStatus: 'fair',
    registeredAt: '2024-03-10'
  },
  {
    id: '4',
    farmerId: 'AADHAAR-4567-8901',
    name: 'Anjali Reddy',
    village: 'Uppal',
    mandal: 'Uppal',
    district: 'Medchal',
    cropType: 'chili',
    cropQuantity: '100',
    landSize: '4',
    totalYield: 90,
    soilStatus: 'good',
    registeredAt: '2024-03-25'
  }
];

function SoilStatusBadge({ status }: { status: FarmerProfile['soilStatus'] }) {
  const config = {
    excellent: { color: 'bg-success/10 text-success border-success/30', label: 'Excellent' },
    good: { color: 'bg-primary/10 text-primary border-primary/30', label: 'Good' },
    fair: { color: 'bg-warning/10 text-warning border-warning/30', label: 'Fair' },
    poor: { color: 'bg-destructive/10 text-destructive border-destructive/30', label: 'Poor' }
  };
  
  const { color, label } = config[status || 'good'];
  
  return (
    <Badge variant="outline" className={cn("font-medium", color)}>
      {label}
    </Badge>
  );
}

export function FarmerProfiles() {
  const { t } = useLanguage();
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerProfile | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<FarmerProfile>>({});

  useEffect(() => {
    // Load from localStorage + mock data
    const stored = localStorage.getItem('farmerData');
    const storedFarmer = stored ? JSON.parse(stored) : null;
    
    const allFarmers = [...MOCK_FARMERS];
    if (storedFarmer && storedFarmer.name) {
      allFarmers.unshift({
        id: 'user-1',
        ...storedFarmer,
        totalYield: parseInt(storedFarmer.cropQuantity) * 0.9,
        soilStatus: 'good',
        registeredAt: new Date().toISOString().split('T')[0]
      });
    }
    setFarmers(allFarmers);
  }, []);

  const handleView = (farmer: FarmerProfile) => {
    setSelectedFarmer(farmer);
    setIsViewOpen(true);
  };

  const handleEdit = (farmer: FarmerProfile) => {
    setSelectedFarmer(farmer);
    setEditData(farmer);
    setIsEditOpen(true);
  };

  const handleUpdate = () => {
    if (selectedFarmer && editData) {
      setFarmers(prev => prev.map(f => 
        f.id === selectedFarmer.id ? { ...f, ...editData } : f
      ));
      if (selectedFarmer.id === 'user-1') {
        localStorage.setItem('farmerData', JSON.stringify(editData));
      }
      toast.success('Profile updated successfully!');
      setIsEditOpen(false);
    }
  };

  const getCropInfo = (cropType: CropType) => {
    return CROP_OPTIONS.find(c => c.value === cropType);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 text-neon-pink mb-4">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{t('farmer.profiles')}</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-neon-pink to-agri-leaf bg-clip-text text-transparent">
          {t('farmer.profiles')}
        </h1>
        <p className="text-muted-foreground mt-2">{t('farmer.profilesSubtitle')}</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glassmorphism border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">{farmers.length}</p>
            <p className="text-sm text-muted-foreground">Total Farmers</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism border-neon-green/20">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-neon-green">
              {farmers.reduce((acc, f) => acc + parseInt(f.landSize || '0'), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Acres</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism border-agri-water/20">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-agri-water">
              {farmers.reduce((acc, f) => acc + (f.totalYield || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground">Total Yield (Q)</p>
          </CardContent>
        </Card>
        <Card className="glassmorphism border-success/20">
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-success">
              {farmers.filter(f => f.soilStatus === 'excellent' || f.soilStatus === 'good').length}
            </p>
            <p className="text-sm text-muted-foreground">Healthy Farms</p>
          </CardContent>
        </Card>
      </div>

      {/* Farmer Cards */}
      {farmers.length === 0 ? (
        <Card className="glassmorphism border-dashed border-2">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('farmer.noProfiles')}</h3>
            <p className="text-muted-foreground">{t('farmer.registerFirst')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmers.map((farmer, index) => {
            const cropInfo = getCropInfo(farmer.cropType);
            return (
              <motion.div
                key={farmer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glassmorphism hover:shadow-lg transition-all hover:border-primary/30 h-full">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-neon-green flex items-center justify-center text-white font-bold text-lg">
                          {farmer.name.charAt(0)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{farmer.name}</CardTitle>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {farmer.village}, {farmer.district}
                          </p>
                        </div>
                      </div>
                      <SoilStatusBadge status={farmer.soilStatus} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Sprout className="h-4 w-4 text-agri-leaf" />
                        <span>{cropInfo?.icon} {cropInfo?.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-agri-earth" />
                        <span>{farmer.landSize} acres</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Scale className="h-4 w-4 text-primary" />
                        <span>{farmer.totalYield || farmer.cropQuantity} Q</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-xs">{farmer.farmerId.slice(0, 15)}...</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleView(farmer)}
                      >
                        <Eye className="h-4 w-4" />
                        {t('common.view')}
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={() => handleEdit(farmer)}
                      >
                        <Edit2 className="h-4 w-4" />
                        {t('common.edit')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Farmer Profile
            </DialogTitle>
            <DialogDescription>Complete profile information</DialogDescription>
          </DialogHeader>
          {selectedFarmer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-neon-green flex items-center justify-center text-white font-bold text-2xl">
                  {selectedFarmer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedFarmer.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedFarmer.farmerId}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('farmer.location')}</p>
                  <p className="font-medium">{selectedFarmer.village}, {selectedFarmer.mandal}</p>
                  <p className="text-sm">{selectedFarmer.district}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('farmer.crop')}</p>
                  <p className="font-medium">{getCropInfo(selectedFarmer.cropType)?.label}</p>
                  <p className="text-sm">{selectedFarmer.cropQuantity} quintals expected</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('farmer.landSize')}</p>
                  <p className="font-medium">{selectedFarmer.landSize} acres</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('farmer.totalYield')}</p>
                  <p className="font-medium">{selectedFarmer.totalYield} quintals</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{t('farmer.soilStatus')}</p>
                  <SoilStatusBadge status={selectedFarmer.soilStatus} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Registered</p>
                  <p className="font-medium">{selectedFarmer.registeredAt}</p>
                </div>
              </div>

              {(selectedFarmer.phone || selectedFarmer.email) && (
                <div className="pt-4 border-t space-y-2">
                  {selectedFarmer.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFarmer.phone}</span>
                    </div>
                  )}
                  {selectedFarmer.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFarmer.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-primary" />
              {t('farmer.updateProfile')}
            </DialogTitle>
            <DialogDescription>Update farmer information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('farmer.name')}</Label>
                <Input 
                  value={editData.name || ''} 
                  onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('farmer.village')}</Label>
                <Input 
                  value={editData.village || ''} 
                  onChange={e => setEditData(prev => ({ ...prev, village: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('farmer.quantity')} (Quintals)</Label>
                <Input 
                  type="number"
                  value={editData.cropQuantity || ''} 
                  onChange={e => setEditData(prev => ({ ...prev, cropQuantity: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('farmer.landSize')} (Acres)</Label>
                <Input 
                  type="number"
                  value={editData.landSize || ''} 
                  onChange={e => setEditData(prev => ({ ...prev, landSize: e.target.value }))}
                />
              </div>
            </div>
            <Button onClick={handleUpdate} className="w-full">
              {t('common.update')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
