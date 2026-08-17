export interface UserProfile {
  id: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: 'male' | 'female' | 'other';
  goal: string;
}

export interface UserGoals {
  dailyCalories: number;
  waterIntakeGoal: number; // in liters
  targetWeight: number; // in kg
}

export type HealthConditionType = 'general' | 'diabetes' | 'ckd' | 'cardiovascular';

export interface HealthMetrics {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  healthGoal: 'Weight Loss' | 'Weight Gain' | 'Maintenance' | 'Muscle Gain';
  healthCondition?: HealthConditionType;
}

export interface NutritionSummary {
  dailyCalorieRequirement: number;
  bmr: number;
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  maintenanceCalories: number;
}
