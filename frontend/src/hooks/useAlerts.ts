import { useState, useEffect, useCallback } from 'react';
import type { Alert } from '@/types/agri';

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'disease',
    severity: 'warning',
    title: 'Possible Leaf Blight Detected',
    message: 'AI analysis suggests early signs of leaf blight in your tomato crop. Take preventive action.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '2',
    type: 'weather',
    severity: 'info',
    title: 'Rain Expected Tomorrow',
    message: 'Light rain forecasted tomorrow afternoon. Consider adjusting irrigation schedule.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '3',
    type: 'irrigation',
    severity: 'warning',
    title: 'Low Soil Moisture',
    message: 'Soil moisture in Field A is below optimal level. Irrigation recommended within 6 hours.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '4',
    type: 'pest',
    severity: 'critical',
    title: 'High Pest Risk Alert',
    message: 'Current weather conditions favor aphid infestation. Monitor crops closely and prepare pesticides.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
  },
];

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 400));
      setAlerts(mockAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const unreadCount = alerts.filter(a => !a.read).length;

  return { alerts, loading, unreadCount, markAsRead, markAllAsRead, dismissAlert };
}
