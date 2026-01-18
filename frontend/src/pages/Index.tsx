import { useState } from 'react';
import { toast } from 'sonner';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/layout/Header';
import { Navigation, type NavItem } from '@/components/layout/Navigation';
import { MobileNav } from '@/components/layout/MobileNav';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DiseaseScanner } from '@/components/disease/DiseaseScanner';
import { IrrigationAdvisor } from '@/components/irrigation/IrrigationAdvisor';
import { WeatherCenter } from '@/components/weather/WeatherCenter';
import { FertilizerAdvisor } from '@/components/fertilizer/FertilizerAdvisor';
import { FarmerRegistration } from '@/components/farmer/FarmerRegistration';
import { FarmerLogin } from '@/components/farmer/FarmerLogin';
import { FarmerProfileView } from '@/components/farmer/FarmerProfileView';
import { CropGuidance } from '@/components/guidance/CropGuidance';
import { YieldPriceInfo } from '@/components/market/YieldPriceInfo';
import { DemandSupply } from '@/components/market/DemandSupply';
import { SplashScreen } from '@/components/splash/SplashScreen';
import { AICopilot } from '@/components/ai/AICopilot';
import { CropInsights } from '@/components/analytics/CropInsights';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const Index = () => {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if farmer data exists in localStorage to simulate login
    const farmerData = localStorage.getItem('farmerData');
    if (farmerData) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleVoiceNavigate = (page: string) => {
    const navMap: Record<string, NavItem> = {
      'dashboard': 'dashboard',
      'scanner': 'disease',
      'irrigation': 'irrigation',
      'weather': 'weather',
      'fertilizer': 'fertilizer',
      'register': 'register',
      'insights': 'insights',
      'guidance': 'guidance',
      'market': 'market',
      'demand': 'demand',
    };
    if (navMap[page]) {
      setActiveNav(navMap[page]);
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveNav} />;
      case 'disease':
        return <DiseaseScanner />;
      case 'irrigation':
        return <IrrigationAdvisor />;
      case 'weather':
        return <WeatherCenter />;
      case 'fertilizer':
        return <FertilizerAdvisor />;
      case 'register':
        return <FarmerRegistration onComplete={() => {
          setIsLoggedIn(true);
          setActiveNav('dashboard');
        }} />;
      case 'login':
        return <FarmerLogin
          onLogin={() => {
            setIsLoggedIn(true);
            setActiveNav('dashboard');
          }}
          onRegisterClick={() => setActiveNav('register')}
        />;
      case 'profile':
        return <FarmerProfileView
          onLogout={() => {
            localStorage.removeItem('farmerData');
            localStorage.removeItem('farmerId');
            localStorage.removeItem('farmer_token');
            setIsLoggedIn(false);
            setActiveNav('dashboard');
            toast.info('Logged out successfully');
          }}
        />;
      case 'insights':
        return isLoggedIn ? <CropInsights /> : <Dashboard onNavigate={setActiveNav} />;
      case 'guidance':
        return <CropGuidance />;
      case 'market':
        return <YieldPriceInfo />;
      case 'demand':
        return <DemandSupply />;
      default:
        return <Dashboard onNavigate={setActiveNav} />;
    }
  };

  return (
    <LanguageProvider>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {!showSplash && (
        <div className="min-h-screen bg-background">
          <Header
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            isMenuOpen={isMobileMenuOpen}
            isLoggedIn={isLoggedIn}
            onProfileClick={() => setActiveNav(isLoggedIn ? 'profile' : 'login')}
          />
          <Navigation
            activeNav={activeNav}
            onNavChange={setActiveNav}
            isMobileMenuOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            isLoggedIn={isLoggedIn}
          />

          {/* Main Content */}
          <main className="md:ml-64 pb-20 md:pb-6">
            <div className="container py-6 px-4">
              <AnimatePresence mode="wait">
                <div key={activeNav}>
                  {renderContent()}
                </div>
              </AnimatePresence>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileNav activeNav={activeNav} onNavChange={setActiveNav} isLoggedIn={isLoggedIn} />

          {/* AI Farming Copilot */}
          <AICopilot />
        </div>
      )}
    </LanguageProvider>
  );
};

export default Index;
