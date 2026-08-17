import { useState } from 'react';
import { analyzeMeal } from '../services/nutritionService';
import type { MealLog } from '../types/nutrition';

export const useNutrition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  const logMeal = async (mealText: string) => {
    setLoading(true);
    setError(null);
    try {
      const report = await analyzeMeal(mealText);
      const newLog: MealLog = {
        id: Date.now().toString(),
        query: mealText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: 'Breakfast',
        report
      };
      setMealLogs(prev => [newLog, ...prev]);
      return newLog;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to analyze meal');
      } else {
        setError('Failed to analyze meal');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { logMeal, mealLogs, loading, error };
};
