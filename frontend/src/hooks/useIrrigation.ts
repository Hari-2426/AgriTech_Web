import { useState, useEffect } from 'react';
import type { IrrigationData } from '@/types/agri';

const generateMockIrrigation = (): IrrigationData => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const now = new Date();
  const currentDay = now.getDay();
  
  const schedule = days.map((day, index) => {
    const dayIndex = (currentDay + index) % 7;
    const isPast = index < 2;
    const isFuture = index > 2;
    
    return {
      day: days[dayIndex],
      time: `${6 + Math.floor(Math.random() * 2)}:${Math.random() > 0.5 ? '00' : '30'} AM`,
      amount: Math.round(150 + Math.random() * 100),
    status: isPast 
        ? (Math.random() > 0.2 ? 'completed' : 'skipped')
        : 'scheduled' as 'completed' | 'scheduled' | 'skipped',
    };
  });

  return {
    soilMoisture: Math.round(35 + Math.random() * 40),
    recommendedWater: Math.round(180 + Math.random() * 70),
    nextIrrigationTime: '6:00 AM Tomorrow',
    waterSavingsPercent: Math.round(15 + Math.random() * 20),
    schedule,
  };
};

export function useIrrigation() {
  const [irrigation, setIrrigation] = useState<IrrigationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIrrigation = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const data = generateMockIrrigation();
      setIrrigation(data);
      
      // Cache for offline
      localStorage.setItem('agri_irrigation_cache', JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
      
      setLoading(false);
    };

    fetchIrrigation();
  }, []);

  const updateMoisture = (value: number) => {
    if (irrigation) {
      setIrrigation({ ...irrigation, soilMoisture: value });
    }
  };

  return { irrigation, loading, updateMoisture, refresh: () => setIrrigation(generateMockIrrigation()) };
}
