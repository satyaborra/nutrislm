import api from './api';
import type { NutritionReport } from '../types/nutrition';

export const analyzeMeal = async (mealText: string): Promise<any> => {
  let attempts = 0;
  while (attempts < 2) {
    try {
      const response = await api.post('/nutrition-ai', { meal: mealText });
      return response.data;
    } catch (error) {
      attempts++;
      console.warn(`API failed (attempt ${attempts})`, error);
      if (attempts >= 2) {
        // Fallback on total failure
        return {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
          fiber: 0,
          suggestion: "Could not analyze meal automatically right now. Please try again."
        };
      }
    }
  }
};
