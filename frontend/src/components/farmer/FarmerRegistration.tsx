import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  Leaf,
  Scale,
  Check,
  ChevronRight,
  Building2,
  Home,
  Phone as PhoneIcon,
  Minimize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { CROP_OPTIONS, CropType } from '@/types/agri';
import { toast } from 'sonner';
import { AP_DISTRICTS, TELANGANA_DISTRICTS } from '@/lib/mockData';

interface FarmerRegistrationProps {
  onComplete?: () => void;
}

interface FarmerData {
  farmerId: string;
  name: string;
  phone: string;
  village: string;
  mandal: string;
  district: string;
  state: 'Andhra Pradesh' | 'Telangana' | '';
  pincode: string;
  cropType: CropType;
  cropQuantity: string;
  landSize: string;
  location?: {
    lat: number;
    lng: number;
    accuracy: number;
    capturedAt: string;
  };
}

export function FarmerRegistration({ onComplete }: FarmerRegistrationProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [formData, setFormData] = useState<FarmerData>({
    farmerId: '', // Will be generated on completion
    name: '',
    phone: '',
    village: '',
    mandal: '',
    district: '',
    state: '',
    pincode: '',
    cropType: 'rice',
    cropQuantity: '',
    landSize: ''
  });

  const updateField = (field: keyof FarmerData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const capturedAt = new Date().toISOString();

        updateField('location', { lat: latitude, lng: longitude, accuracy, capturedAt });
        toast.success("Location captured successfully");

        try {
          // Fetch with zoom=18 for maximum detail (village/street level)
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`);
          const data = await response.json();
          console.log("Geocoding Data:", data); // For debugging

          if (data && data.address) {
            const addr = data.address;
            const state = addr.state;

            // 1. Auto-fill State
            if (state && (state.includes('Andhra Pradesh') || state.includes('Telangana'))) {
              const matchedState = state.includes('Andhra Pradesh') ? 'Andhra Pradesh' : 'Telangana';
              updateField('state', matchedState);

              // 2. Auto-fill District
              // OSM mapping: state_district (usually correct for District), district, or county
              const districtCandidates = [addr.state_district, addr.district, addr.county, addr.region].filter(Boolean);
              const predefinedDistricts = matchedState === 'Andhra Pradesh' ? AP_DISTRICTS : TELANGANA_DISTRICTS;

              const matchedDistrict = predefinedDistricts.find(d =>
                districtCandidates.some(candidate =>
                  candidate.toLowerCase().includes(d.toLowerCase()) ||
                  d.toLowerCase().includes(candidate.toLowerCase().replace(' district', '').trim())
                )
              );

              if (matchedDistrict) {
                updateField('district', matchedDistrict);
              }

              // 3. Auto-fill Mandal (Tehsil/Taluk)
              // OSM mapping: county is often the Mandal/Tehsil in India if state_district is the District
              // Fallback to town or suburb if county is missing or likely incorrect
              const mandalCandidate = addr.county || addr.town || addr.suburb || addr.municipality;
              if (mandalCandidate && mandalCandidate !== matchedDistrict) {
                updateField('mandal', mandalCandidate.replace(' Mandal', ''));
              }

              // 4. Auto-fill Village
              const villageCandidate = addr.village || addr.hamlet || addr.neighbourhood || addr.city_district;
              if (villageCandidate) {
                updateField('village', villageCandidate);
              }

              // 5. Auto-fill Pincode
              if (addr.postcode) {
                updateField('pincode', addr.postcode);
              }
            }
          }
        } catch (error) {
          console.warn("Reverse geocoding failed:", error);
          toast.error("Could not auto-fill address details. Please enter manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error("Unable to access location. Please enter address manually.");
        console.error("Geolocation error:", error);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const generateFarmerId = (state: string) => {
    const stateCode = state === 'Andhra Pradesh' ? 'AP' : 'TG';
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `AGRI-${stateCode}-2026-${randomNum}`;
  };

  const handleSubmit = () => {
    const finalId = generateFarmerId(formData.state);
    const finalData = { ...formData, farmerId: finalId };

    // Store in registeredFarmers list for persistence across sessions
    const registeredFarmers = JSON.parse(localStorage.getItem('registeredFarmers') || '[]');
    // Avoid duplicates if same phone is used (though basic mock)
    const existingIndex = registeredFarmers.findIndex((f: any) => f.phone === finalData.phone);
    let updatedFarmers;
    if (existingIndex >= 0) {
      updatedFarmers = [...registeredFarmers];
      updatedFarmers[existingIndex] = finalData;
    } else {
      updatedFarmers = [...registeredFarmers, finalData];
    }
    localStorage.setItem('registeredFarmers', JSON.stringify(updatedFarmers));

    // Store current session
    localStorage.setItem('farmerData', JSON.stringify(finalData));
    setFormData(finalData); // Update local state for success view
    setIsSubmitted(true);

    toast.success(t('farmer.registrationSuccess'));

    // Auto-login after a brief delay
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
  };

  const isStep1Valid = formData.name && formData.phone;
  const isStep2Valid = formData.state && formData.district && formData.village && formData.pincode;
  const isStep3Valid = formData.cropType && formData.cropQuantity && formData.landSize;

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/30 rounded-[2rem] shadow-xl overflow-hidden">
          <CardContent className="flex flex-col items-center py-12 px-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-8 shadow-inner"
            >
              <Check className="h-12 w-12 text-success" />
            </motion.div>
            <h2 className="text-3xl font-black text-success mb-2 uppercase tracking-tight">{t('farmer.registrationComplete')}</h2>
            <p className="text-muted-foreground text-center mb-8 font-medium">Redirecting you to dashboard...</p>
            <div className="bg-white dark:bg-black/20 rounded-[1.5rem] p-6 border w-full max-w-md shadow-inner">
              <div className="space-y-4 text-sm font-bold">
                <div className="flex justify-between items-center bg-primary/5 p-3 rounded-xl border border-primary/20">
                  <span className="text-primary uppercase tracking-widest text-[10px]">Farmer ID</span>
                  <span className="font-black text-primary select-all">{formData.farmerId}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">{t('farmer.name')}</span>
                  <span className="font-bold">{formData.name}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">{t('farmer.location')}</span>
                  <span className="font-bold">{formData.village}, {formData.district}</span>
                </div>
                {formData.location && (
                  <div className="mt-2 pt-2 border-t border-dashed flex justify-between items-center px-2 opacity-60">
                    <span className="text-muted-foreground font-black uppercase tracking-widest text-[9px]">Coordinates</span>
                    <span className="text-[10px] font-mono">{formData.location.lat.toFixed(4)}°, {formData.location.lng.toFixed(4)}°</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-4">
          <User className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-black bg-gradient-to-r from-primary via-emerald-500 to-agri-leaf bg-clip-text text-transparent uppercase tracking-tight">
          {t('farmer.registration')}
        </h1>
        <p className="text-muted-foreground mt-3 font-medium text-lg">{t('farmer.registrationSubtitle')}</p>
      </motion.div>

      <div className="flex justify-center">
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <motion.div
                animate={{
                  backgroundColor: step >= s ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  scale: step === s ? 1.2 : 1,
                  boxShadow: step === s ? '0 0 20px rgba(var(--primary-rgb), 0.3)' : 'none'
                }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black"
              >
                {step > s ? <Check className="h-6 w-6 text-primary-foreground" /> :
                  <span className={step >= s ? 'text-primary-foreground' : 'text-muted-foreground'}>{s}</span>
                }
              </motion.div>
              {s < 3 && (
                <div className={`w-20 h-1.5 mx-2 rounded-full ${step > s ? 'bg-primary' : 'bg-muted'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-2xl mx-auto"
      >
        {step === 1 && (
          <Card className="glassmorphism border-primary/20 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                {t('farmer.identityDetails')}
              </CardTitle>
              <CardDescription className="font-medium">{t('farmer.identityDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.name')}</Label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="name"
                    placeholder={t('farmer.enterName')}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="pl-12 h-14 bg-background/50 border-primary/20 focus:border-primary rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                <div className="relative group">
                  <PhoneIcon className="absolute left-4 top-4 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="phone"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="pl-12 h-14 bg-background/50 border-primary/20 focus:border-primary rounded-xl font-bold"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="glassmorphism border-primary/20 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <MapPin className="h-6 w-6 text-emerald-500" />
                {t('farmer.locationDetails')}
              </CardTitle>
              <CardDescription className="font-medium">{t('farmer.locationDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="flex justify-end mb-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="rounded-xl border-primary/20 hover:bg-primary/5 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                >
                  <MapPin className={cn("h-3.5 w-3.5", isLocating && "animate-pulse")} />
                  {isLocating ? "Capturing..." : "Use Current Location"}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</Label>
                  <Select value={formData.state} onValueChange={(v) => {
                    updateField('state', v as 'Andhra Pradesh' | 'Telangana');
                    updateField('district', '');
                  }}>
                    <SelectTrigger className="h-14 bg-background/50 border-primary/20 rounded-xl font-bold">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Andhra Pradesh" className="font-bold">Andhra Pradesh</SelectItem>
                      <SelectItem value="Telangana" className="font-bold">Telangana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.district')}</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(v) => updateField('district', v)}
                    disabled={!formData.state}
                  >
                    <SelectTrigger className="h-14 bg-background/50 border-primary/20 rounded-xl font-bold">
                      <SelectValue placeholder={t('farmer.selectDistrict')} />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.state === 'Andhra Pradesh' ? AP_DISTRICTS : TELANGANA_DISTRICTS).map((d) => (
                        <SelectItem key={d} value={d} className="font-bold">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="mandal" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.mandal')}</Label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="mandal"
                      placeholder="Enter mandal"
                      value={formData.mandal}
                      onChange={(e) => updateField('mandal', e.target.value)}
                      className="pl-12 h-14 bg-background/50 border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="village" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.village')}</Label>
                  <div className="relative group">
                    <Home className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="village"
                      placeholder={t('farmer.enterVillage')}
                      value={formData.village}
                      onChange={(e) => updateField('village', e.target.value)}
                      className="pl-12 h-14 bg-background/50 border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="pincode" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pincode</Label>
                <Input
                  id="pincode"
                  placeholder="XXXXXX"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  className="h-14 bg-background/50 border-primary/20 rounded-xl font-bold"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="glassmorphism border-primary/20 rounded-[2rem] shadow-xl overflow-hidden">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black uppercase tracking-widest flex items-center gap-3">
                <Leaf className="h-6 w-6 text-emerald-500" />
                {t('farmer.cropDetails')}
              </CardTitle>
              <CardDescription className="font-medium">{t('farmer.cropDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.cropType')}</Label>
                <Select value={formData.cropType} onValueChange={(v) => updateField('cropType', v as CropType)}>
                  <SelectTrigger className="h-14 bg-background/50 border-primary/20 rounded-xl font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CROP_OPTIONS.map((crop) => (
                      <SelectItem key={crop.value} value={crop.value} className="font-bold">
                        <span className="flex items-center gap-2">
                          <span className="text-xl">{crop.icon}</span>
                          <span>{t(`crop.${crop.value}`)}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.quantity')}</Label>
                  <div className="relative group">
                    <Scale className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="100"
                      value={formData.cropQuantity}
                      onChange={(e) => updateField('cropQuantity', e.target.value)}
                      className="pl-12 h-14 bg-background/50 border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="landSize" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{t('farmer.landSize')}</Label>
                  <div className="relative group">
                    <Minimize2 className="absolute left-4 top-4 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="landSize"
                      type="number"
                      placeholder="5"
                      value={formData.landSize}
                      onChange={(e) => updateField('landSize', e.target.value)}
                      className="pl-12 h-14 bg-background/50 border-primary/20 rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <div className="flex justify-center gap-6">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)} className="h-14 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]">
            {t('common.back')}
          </Button>
        )}
        {step < 3 ? (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
            className="h-14 px-10 gap-2 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {t('common.next')}
            <ChevronRight className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isStep3Valid}
            className="h-14 px-10 gap-3 bg-gradient-to-r from-primary to-emerald-600 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            <Check className="h-5 w-5" />
            {t('farmer.register')}
          </Button>
        )}
      </div>
    </div>
  );
}
