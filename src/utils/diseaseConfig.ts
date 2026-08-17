import type { HealthConditionType } from '../types/user';

export type TargetType = 'demo' | 'user' | 'clinician' | 'guideline';
export type EvidenceLevel = 'high' | 'moderate' | 'low';

export interface TargetConfig {
  value: number;
  type: TargetType;
  source?: string;
}

export interface MetricConfig {
  id: string;
  label: string;
  unit: string;
  target?: TargetConfig;
  max?: number;
  color: string;
  isLowerBetter?: boolean;
}

export interface InsightRule {
  condition: (value: number, target: number) => boolean;
  insight: string;
  evidence: {
    sources: string[];
    supportLevel: EvidenceLevel;
  };
}

export interface DiseaseConfiguration {
  id: HealthConditionType;
  name: string;
  displayName: string;
  description: string;
  metrics: MetricConfig[];
  insightRules?: Record<string, InsightRule[]>;
  relevantNutrients: string[];
  evidenceCategories: string[];
  mockData?: any;
}

export const diseaseConfigurations: Record<HealthConditionType, DiseaseConfiguration> = {
  general: {
    id: 'general',
    name: 'General',
    displayName: 'General Health',
    description: 'No Specific Condition',
    relevantNutrients: ['Calories', 'Protein', 'Carbs', 'Fat'],
    evidenceCategories: ['General Nutrition Guidelines'],
    metrics: [
      { id: 'calories', label: 'Calories', unit: 'kcal', color: 'text-amber-500', target: { value: 2000, type: 'demo' } },
      { id: 'protein', label: 'Protein', unit: 'g', color: 'text-emerald-500', target: { value: 150, type: 'demo' } },
      { id: 'carbs', label: 'Carbs', unit: 'g', color: 'text-blue-500', target: { value: 300, type: 'demo' } },
      { id: 'fat', label: 'Fat', unit: 'g', color: 'text-amber-500', target: { value: 80, type: 'demo' } }
    ]
  },
  diabetes: {
    id: 'diabetes',
    name: 'Type 2 Diabetes',
    displayName: 'Type 2 Diabetes',
    description: 'Glucose & Diet Management',
    relevantNutrients: ['Carbohydrates', 'Fiber', 'Added Sugar', 'Glycemic Load'],
    evidenceCategories: ['ADA Guidelines', 'Nutrition Database', 'Endocrinology Guidelines'],
    metrics: [
      { id: 'bloodGlucose', label: 'Blood Glucose', unit: 'mg/dL', color: 'text-rose-500', target: { value: 110, type: 'demo', source: 'ADA Standard' } },
      { id: 'carbs', label: 'Carbohydrates', unit: 'g', color: 'text-blue-500', target: { value: 150, type: 'demo' } },
      { id: 'addedSugar', label: 'Added Sugar', unit: 'g', isLowerBetter: true, color: 'text-amber-500', target: { value: 25, type: 'demo' } },
      { id: 'fiber', label: 'Fiber', unit: 'g', color: 'text-emerald-500', target: { value: 30, type: 'demo' } },
      { id: 'glycemicLoad', label: 'Glycemic Load', unit: '', isLowerBetter: true, color: 'text-indigo-500', target: { value: 50, type: 'demo' } }
    ],
    insightRules: {
      carbs: [
        {
          condition: (val, target) => val > target,
          insight: 'Estimated high carbohydrate load detected. Consider balancing subsequent meals with higher fiber and lower refined carbohydrates, as per dietary suggestions.',
          evidence: { sources: ['Dietary guideline', 'Nutrition database'], supportLevel: 'high' }
        },
        {
          condition: (val, target) => val <= target,
          insight: 'Your carbohydrate intake aligns with the configured demo targets for glycemic management.',
          evidence: { sources: ['Dietary guideline'], supportLevel: 'high' }
        }
      ]
    },
    mockData: {
      glucoseTrend: [
        { time: '08:00', glucose: 95, carbs: 0 },
        { time: '10:00', glucose: 138, carbs: 48 },
        { time: '12:00', glucose: 112, carbs: 0 },
        { time: '14:00', glucose: 145, carbs: 65 },
        { time: '16:00', glucose: 120, carbs: 0 },
        { time: '18:00', glucose: 105, carbs: 15 },
        { time: '20:00', glucose: 130, carbs: 55 },
      ]
    }
  },
  ckd: {
    id: 'ckd',
    name: 'Chronic Kidney Disease',
    displayName: 'CKD',
    description: 'Kidney Care & Renal Diet',
    relevantNutrients: ['Potassium', 'Phosphorus', 'Sodium', 'Protein', 'Fluid'],
    evidenceCategories: ['KDOQI Guidelines', 'Renal Nutrition Manual'],
    metrics: [
      { id: 'protein', label: 'Protein', unit: 'g', isLowerBetter: true, color: 'text-blue-500', target: { value: 65, type: 'demo' } },
      { id: 'sodium', label: 'Sodium', unit: 'mg', isLowerBetter: true, color: 'text-rose-500', target: { value: 2000, type: 'demo' } },
      { id: 'potassium', label: 'Potassium', unit: 'mg', isLowerBetter: true, color: 'text-amber-500', target: { value: 2000, type: 'demo' } },
      { id: 'phosphorus', label: 'Phosphorus', unit: 'mg', isLowerBetter: true, color: 'text-purple-500', target: { value: 800, type: 'demo' } },
      { id: 'fluid', label: 'Fluid', unit: 'L', isLowerBetter: true, color: 'text-cyan-500', target: { value: 2.0, type: 'demo' } }
    ],
    insightRules: {
      potassium: [
        {
          condition: (val, target) => val > target,
          insight: 'Estimated high potassium intake. Based on configured renal profiles, monitoring potassium is suggested. Consider adjusting subsequent meals.',
          evidence: { sources: ['KDOQI Guidelines'], supportLevel: 'high' }
        }
      ]
    },
    mockData: {
      currentValues: {
        protein: 58,
        sodium: 1420,
        potassium: 1850,
        phosphorus: 720,
        fluid: 1.6
      }
    }
  },
  cardiovascular: {
    id: 'cardiovascular',
    name: 'Cardiovascular Disease',
    displayName: 'Cardiovascular',
    description: 'Heart Health & Lipids',
    relevantNutrients: ['Sodium', 'Saturated Fat', 'Cholesterol', 'Fiber', 'Omega-3'],
    evidenceCategories: ['AHA Guidelines', 'Cardiology Research'],
    metrics: [
      { id: 'sodium', label: 'Sodium', unit: 'mg', isLowerBetter: true, color: 'text-rose-500', target: { value: 2000, type: 'demo' } },
      { id: 'saturatedFat', label: 'Saturated Fat', unit: 'g', isLowerBetter: true, color: 'text-amber-500', target: { value: 13, type: 'demo' } },
      { id: 'cholesterol', label: 'Cholesterol', unit: 'mg', isLowerBetter: true, color: 'text-red-500', target: { value: 200, type: 'demo' } },
      { id: 'fiber', label: 'Fiber', unit: 'g', color: 'text-emerald-500', target: { value: 30, type: 'demo' } },
      { id: 'omega3', label: 'Omega-3', unit: 'g', color: 'text-blue-500', target: { value: 1.5, type: 'demo' } }
    ],
    mockData: {
      heartScore: 87,
      currentValues: {
        sodium: 1420,
        saturatedFat: 9,
        cholesterol: 145,
        fiber: 24,
        omega3: 1.2
      }
    }
  }
};

export const generateClinicalInsight = (conditionId: HealthConditionType, metricId: string, value: number): { insight: string; evidence?: any } | null => {
  const config = diseaseConfigurations[conditionId];
  if (!config || !config.insightRules || !config.insightRules[metricId]) return null;

  const metricConfig = config.metrics.find(m => m.id === metricId);
  if (!metricConfig || !metricConfig.target) return null;

  const rules = config.insightRules[metricId];
  for (const rule of rules) {
    if (rule.condition(value, metricConfig.target.value)) {
      return {
        insight: rule.insight,
        evidence: rule.evidence
      };
    }
  }
  return null;
};
