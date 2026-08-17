import React, { useState, useEffect } from 'react';
import { Activity, Coffee, Sunset, Sun, Sunrise, Utensils } from 'lucide-react';
import HealthProfileForm from '../components/HealthProfileForm';
import BMICard from '../components/BMICard';
import CalorieSummaryCard from '../components/CalorieSummaryCard';
import DietPlanCard from '../components/DietPlanCard';
import MacroChart from '../components/MacroChart';
import { WeightProgressChart, CalorieConsumptionChart } from '../components/ProgressCharts';
import type { HealthMetrics, NutritionSummary } from '../types/user';
import { generateDietPlan } from '../services/healthService';
import type { DietPlan } from '../types/diet';

const INITIAL_DATA: HealthMetrics = {
  age: 28,
  gender: 'female',
  heightCm: 165,
  weightKg: 64,
  activityLevel: 'moderately_active',
  healthGoal: 'Weight Loss'
};

const HealthProfile: React.FC = () => {
  const [formData, setFormData] = useState<HealthMetrics>(INITIAL_DATA);
  const [summary, setSummary] = useState<NutritionSummary | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  // Auto-calculate BMI & BMR when inputs change
  useEffect(() => {
    const { age, gender, heightCm, weightKg, activityLevel, healthGoal } = formData;
    if (!heightCm || !weightKg || !age) return;

    // BMI Calculation
    const heightM = heightCm / 100;
    const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
    
    let bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = 'Normal';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';

    // BMR Calculation (Mifflin-St Jeor)
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;
    bmr = Math.round(bmr);

    // Activity Multiplier
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    const maintenance = Math.round(bmr * multipliers[activityLevel]);
    
    // Target Calories Calculation
    let target = maintenance;
    if (healthGoal === 'Weight Loss') target = maintenance - 500;
    else if (healthGoal === 'Weight Gain' || healthGoal === 'Muscle Gain') target = maintenance + 300;

    setSummary({
      bmi,
      bmiCategory,
      bmr,
      maintenanceCalories: maintenance,
      dailyCalorieRequirement: target
    });
  }, [formData]);

  // Fetch AI Diet Plan only when the goal changes (or on mount)
  useEffect(() => {
    generateDietPlan(formData.healthGoal).then(setDietPlan);
  }, [formData.healthGoal]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end border-b border-gray-100 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Personalized Health Profile</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Configure your metrics to generate real-time AI diet plans.</p>
        </div>
      </div>

      {/* Row 1: Form and Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-full">
          <HealthProfileForm data={formData} onChange={setFormData} />
        </div>
        
        {summary && (
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BMICard summary={summary} />
            <CalorieSummaryCard summary={summary} />
          </div>
        )}
      </div>

      {/* Row 2: Recommendation Alerts */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 shadow-sm flex items-start gap-4">
        <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl mt-0.5"><Activity className="h-6 w-6"/></div>
        <div>
          <h4 className="font-bold text-indigo-900 text-lg">AI Goal Recommendation: {formData.healthGoal}</h4>
          <p className="text-indigo-800 font-medium text-sm mt-1 leading-relaxed">
            Based on your calculated BMI and profile constraints, we recommend a <strong>{formData.healthGoal === 'Weight Loss' ? 'High-Protein, Calorie Deficit' : formData.healthGoal === 'Muscle Gain' ? 'Hypercaloric High-Protein' : 'Balanced Maintenance'}</strong> diet. Ensure you consume at least 1.8g of protein per kg of bodyweight to optimize physiological outcomes.
          </p>
        </div>
      </div>

      {/* Row 3: Diet Plan and Macros */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Utensils className="text-emerald-500" /> Auto-Generated Diet Plan</h3>
          {dietPlan && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DietPlanCard meal={dietPlan.breakfast} title="Breakfast" icon={<Sunrise className="h-5 w-5" />} />
              <DietPlanCard meal={dietPlan.lunch} title="Lunch" icon={<Sun className="h-5 w-5" />} />
              <DietPlanCard meal={dietPlan.dinner} title="Dinner" icon={<Sunset className="h-5 w-5" />} />
              <DietPlanCard meal={dietPlan.snacks[0]} title="Snack" icon={<Coffee className="h-5 w-5" />} />
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="font-bold text-gray-900 self-start mb-6">Target Macronutrient Split</h3>
          <div className="w-full flex-1">
             <MacroChart 
                protein={formData.healthGoal === 'Muscle Gain' ? 40 : 35} 
                carbs={formData.healthGoal === 'Weight Loss' ? 30 : 40} 
                fat={formData.healthGoal === 'Weight Loss' ? 35 : 25} 
             />
          </div>
        </div>
      </div>

      {/* Row 4: Progress Charts */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 mt-6">Historical Tracking Hub</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-2">Weight Progress (6 Months)</h4>
            <WeightProgressChart />
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-700 mb-2">Calorie Consumption (7 Days)</h4>
            <CalorieConsumptionChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
