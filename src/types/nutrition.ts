import type { MealCategory } from '../components/MealCategoryTabs';

export interface Macros {
  protein: number;
  carbs: number;
  fat: number;
  sugar?: number;
  sodium?: number;
  fiber?: number;
}

export interface NutritionReport {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  suggestion: string;
}

export interface MealLog {
  id: string;
  query: string;
  time: string;
  category: MealCategory;
  report: NutritionReport;
}
