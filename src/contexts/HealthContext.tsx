import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface HealthData {
  weight: number | null;
  height: number | null;
  goal: string | null;
  target_weight: number | null;
  healthCondition?: 'general' | 'diabetes' | 'ckd' | 'cardiovascular';
  healthGoal?: string | null;
}

interface HealthContextType {
  healthData: HealthData | null;
  isLoading: boolean;
  refreshHealthData: () => Promise<void>;
  updateHealthData: (data: Partial<HealthData>) => Promise<void>;
}

const HealthContext = createContext<HealthContextType | undefined>(undefined);

export const HealthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchHealthProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('http://localhost:8000/api/user/health-profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const updateHealthData = async (data: Partial<HealthData>) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/user/health-profile', {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const updated = await res.json();
        setHealthData(updated);
        console.log("Health Data:", updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchHealthProfile();
    }
  }, [isAuthenticated]);

  return (
    <HealthContext.Provider value={{ healthData, isLoading, refreshHealthData: fetchHealthProfile, updateHealthData }}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (context === undefined) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};
