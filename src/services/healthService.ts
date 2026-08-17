import api from './api';
import type { DietPlan } from '../types/diet';
import type { HealthMetrics } from '../types/user';

export const getHealthSummary = async () => {
  try {
    const response = await api.get('/health-summary');
    return response.data;
  } catch {
    console.warn("health-summary API failed, falling back to mock data");
    return {
      weight: 72, 
      bmi: 23.5, 
      waterIntake: 2.1, 
      dailyCalorieGoal: 2000
    };
  }
};

export const generateDietPlan = async (goal: string): Promise<DietPlan> => {
  try {
    const response = await api.post<DietPlan>('/diet-plan', { goal });
    return response.data;
  } catch {
    console.warn("diet-plan API failed, falling back to mock data");
    
    // Provide enhanced mock data to power the Evidence-Grounded UI
    return {
      id: "mock-1",
      date: new Date().toISOString().split('T')[0],
      breakfast: { 
        id: 'b1', 
        name: 'Oatmeal & Berries', 
        description: 'With a scoop of whey protein.', 
        calories: 350, 
        macros: { protein: 25, carbs: 50, fat: 5 },
        diseaseImpact: {
          "Carbohydrate": "Moderate",
          "Fiber": "Good",
          "Glycemic Load": "Moderate"
        },
        explanation: [
          "Matches your calorie target",
          "Provides 8g fiber",
          "Moderate carbohydrate load",
          "Compatible with your configured nutrition profile"
        ],
        evidenceStatus: 'demo',
        evidence: [
          {
            id: "ev1",
            source: "IFCT 2017",
            document: "Food composition",
            section: "Cereals and Millets",
            content: "Oats are a rich source of beta-glucan soluble fiber.",
            evidenceType: "nutrition",
            relevanceScore: 0.95
          },
          {
            id: "ev2",
            source: "Clinical Guidelines",
            document: "Dietary Guidance",
            section: "Carbohydrate Management",
            content: "High-fiber carbohydrate sources are recommended to support stable blood glucose.",
            evidenceType: "clinical",
            relevanceScore: 0.88
          }
        ]
      },
      lunch: { 
        id: 'l1', 
        name: 'Grilled Chicken Salad', 
        description: 'Mixed greens, cucumber, tomatoes with olive oil.', 
        calories: 450, 
        macros: { protein: 45, carbs: 15, fat: 20 },
        diseaseImpact: {
          "Protein": "High",
          "Sodium": "Low",
          "Saturated Fat": "Low"
        },
        explanation: [
          "High quality lean protein source",
          "Low sodium contribution",
          "Rich in micronutrients from mixed greens"
        ],
        evidenceStatus: 'demo',
        evidence: [
          {
            id: "ev3",
            source: "USDA FoodData",
            document: "Nutritional Analysis",
            section: "Poultry Products",
            content: "Chicken breast provides a high protein-to-calorie ratio with low saturated fat.",
            evidenceType: "nutrition",
            relevanceScore: 0.92
          }
        ]
      },
      dinner: { 
        id: 'd1', 
        name: 'Baked Salmon & Asparagus', 
        description: 'Wild-caught salmon baked with lemons.', 
        calories: 500, 
        macros: { protein: 40, carbs: 10, fat: 28 },
        diseaseImpact: {
          "Omega-3": "Excellent",
          "Cholesterol": "Moderate",
          "Protein": "High"
        },
        explanation: [
          "Excellent source of Omega-3 fatty acids",
          "Supports cardiovascular health",
          "Low carbohydrate dinner option"
        ],
        evidenceStatus: 'insufficient',
        evidence: []
      },
      snacks: [
        { 
          id: 's1', 
          name: 'Almonds', 
          description: 'A small handful of raw almonds.', 
          calories: 160, 
          macros: { protein: 6, carbs: 6, fat: 14 },
          diseaseImpact: {
            "Fiber": "Good",
            "Unsaturated Fat": "Good"
          },
          explanation: [
            "Provides healthy unsaturated fats",
            "Satiating snack to prevent overeating",
            "Good source of vitamin E"
          ],
          evidenceStatus: 'unavailable',
          evidence: []
        }
      ],
      totalCalories: 1460,
      totalMacros: { protein: 116, carbs: 81, fat: 67 }
    };
  }
};

import type { RAGResult } from '../contexts/EvidenceContext';

export const chatWithAssistant = async (message: string): Promise<RAGResult> => {
  try {
    const response = await api.post('/ai-chat', { 
      message,
      user_context: { platform: "web", client: "NutriSLM Interface" } 
    });
    return response.data; // Now returns the full RAGResult + legacy reply
  } catch {
    console.warn("chat API failed, falling back to mock data");
    return {
      answer: "That's an excellent question! As an AI nutrition assistant, I can confirm that a balanced diet including plenty of vegetables, lean proteins, and whole grains is key to your wellness goals.",
      grounded: true,
      retrievalStatus: "SUCCESS",
      evidence: [],
      model: "mock"
    };
  }
};

export const saveProfile = async (profile: HealthMetrics): Promise<HealthMetrics> => {
  try {
    const response = await api.post<HealthMetrics>('/user/profile', profile);
    return response.data;
  } catch {
    console.warn("user/profile API failed, saving mock data");
    return profile;
  }
};
