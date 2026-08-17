import type { Macros } from './nutrition';

export interface MealInsight {
  insight: string;
  category: "metabolism" | "fat_loss" | "satiety" | "muscle" | "timing" | "behavior" | "hydration";
}

export interface MealEvidence {
  id: string;
  source: string;
  document: string;
  section: string;
  content: string;
  evidenceType: string;
  relevanceScore: number;
  disease?: string;
  food?: string;
}

export type EvidenceStatus = 'retrieved' | 'demo' | 'insufficient' | 'unavailable';

export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  macros: Macros;
  diseaseImpact?: {
    [metric: string]: 'Good' | 'Moderate' | 'High' | string;
  };
  explanation?: string[]; // Bullet points for "Why This Meal?"
  evidence?: MealEvidence[];
  evidenceStatus?: EvidenceStatus;
  ai_insight?: MealInsight; // Legacy
}

export interface DietPlan {
  id: string;
  date: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal[];
  totalCalories: number;
  totalMacros: Macros;
}
