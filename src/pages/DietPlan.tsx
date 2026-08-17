import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { generateDietPlan } from '../services/healthService';
import type { DietPlan as DietPlanType } from '../types/diet';
import { useHealth } from '../contexts/HealthContext';

import DietPlanHeader from '../components/diet/DietPlanHeader';
import PersonalizationSummary from '../components/diet/PersonalizationSummary';
import NutritionTargets from '../components/diet/NutritionTargets';
import DiseaseNutritionFocus from '../components/diet/DiseaseNutritionFocus';
import MealRecommendationCard from '../components/diet/MealRecommendationCard';
import DailyProgress from '../components/diet/DailyProgress';

const DietPlan: React.FC = () => {
  const [plan, setPlan] = useState<DietPlanType | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const { healthData } = useHealth();

  const fetchPlan = async () => {
    setLoading(true);
    const newPlan = await generateDietPlan(healthData?.healthGoal || "weight_loss");
    setPlan(newPlan);
    setCompletedMeals(new Set());
    setLoading(false);
  };

  useEffect(() => {
    fetchPlan();
  }, [healthData?.healthGoal]);

  const toggleMealCompletion = (mealId: string) => {
    setCompletedMeals(prev => {
      const next = new Set(prev);
      if (next.has(mealId)) next.delete(mealId);
      else next.add(mealId);
      return next;
    });
  };

  const handleSwap = (mealId: string) => {
    alert(`Swap logic triggered for meal ${mealId}. Alternative RAG pipeline would be invoked here.`);
  };

  if (loading || !plan) {
    return <div className="p-12 text-center text-gray-500 font-medium">Generating your personalized AI diet plan...</div>;
  }

  // Calculate accumulated progress based on completed meals
  let completedCalories = 0, completedProtein = 0, completedCarbs = 0, completedFiber = 0;
  
  const processMealProgress = (meal: any) => {
    if (completedMeals.has(meal.id)) {
      completedCalories += meal.calories || 0;
      completedProtein += meal.macros?.protein || 0;
      completedCarbs += meal.macros?.carbs || 0;
      completedFiber += 8; // Demo assumption for fiber per meal if not in macros
    }
  };

  processMealProgress(plan.breakfast);
  processMealProgress(plan.lunch);
  processMealProgress(plan.dinner);
  plan.snacks.forEach(processMealProgress);

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <DietPlanHeader date={plan.date} />
      
      <PersonalizationSummary />
      
      <NutritionTargets 
        totalCalories={plan.totalCalories}
        totalProtein={plan.totalMacros.protein}
        totalCarbs={plan.totalMacros.carbs}
        totalFat={plan.totalMacros.fat}
      />
      
      <DiseaseNutritionFocus />

      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-xl font-bold text-gray-900">Today's Meal Plan</h2>
        <button 
          onClick={fetchPlan}
          className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Plan
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <MealRecommendationCard 
          title="Breakfast" 
          meal={plan.breakfast} 
          iconBg="bg-amber-100 text-amber-600" 
          isCompleted={completedMeals.has(plan.breakfast.id)}
          onComplete={() => toggleMealCompletion(plan.breakfast.id)}
          onSwap={() => handleSwap(plan.breakfast.id)}
        />
        <MealRecommendationCard 
          title="Lunch" 
          meal={plan.lunch} 
          iconBg="bg-blue-100 text-blue-600" 
          isCompleted={completedMeals.has(plan.lunch.id)}
          onComplete={() => toggleMealCompletion(plan.lunch.id)}
          onSwap={() => handleSwap(plan.lunch.id)}
        />
        <MealRecommendationCard 
          title="Dinner" 
          meal={plan.dinner} 
          iconBg="bg-indigo-100 text-indigo-600" 
          isCompleted={completedMeals.has(plan.dinner.id)}
          onComplete={() => toggleMealCompletion(plan.dinner.id)}
          onSwap={() => handleSwap(plan.dinner.id)}
        />
        {plan.snacks.map((snack, idx) => (
          <MealRecommendationCard 
            key={snack.id}
            title={`Snack ${idx + 1}`} 
            meal={snack} 
            iconBg="bg-purple-100 text-purple-600" 
            isCompleted={completedMeals.has(snack.id)}
            onComplete={() => toggleMealCompletion(snack.id)}
            onSwap={() => handleSwap(snack.id)}
          />
        ))}
      </div>

      <DailyProgress 
        totalCalories={plan.totalCalories}
        totalProtein={plan.totalMacros.protein}
        totalCarbs={plan.totalMacros.carbs}
        totalFiber={30}
        completedCalories={completedCalories}
        completedProtein={completedProtein}
        completedCarbs={completedCarbs}
        completedFiber={completedFiber}
      />
    </div>
  );
};

export default DietPlan;
