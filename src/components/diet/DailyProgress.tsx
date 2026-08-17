import React from 'react';
import { useHealth } from '../../contexts/HealthContext';

interface DailyProgressProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFiber: number;
  completedCalories: number;
  completedProtein: number;
  completedCarbs: number;
  completedFiber: number;
}

const DailyProgress: React.FC<DailyProgressProps> = ({
  totalCalories, totalProtein, totalCarbs, totalFiber,
  completedCalories, completedProtein, completedCarbs, completedFiber
}) => {
  const { healthData } = useHealth();

  const renderProgressBar = (label: string, current: number, target: number, colorClass: string) => {
    const percentage = Math.min(100, Math.max(0, (current / target) * 100)) || 0;
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex justify-between text-sm font-medium mb-1.5">
          <span className="text-gray-700">{label}</span>
          <span className="text-gray-900">{current} <span className="text-gray-400 font-normal">/ {target}</span></span>
        </div>
        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} transition-all duration-500 ease-out`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Today's Nutrition Progress</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Macronutrients</h4>
          {renderProgressBar('Calories (kcal)', completedCalories, totalCalories, 'bg-emerald-500')}
          {renderProgressBar('Protein (g)', completedProtein, totalProtein, 'bg-blue-500')}
          {renderProgressBar('Carbohydrates (g)', completedCarbs, totalCarbs, 'bg-amber-500')}
          {renderProgressBar('Fiber (g)', completedFiber, totalFiber, 'bg-purple-500')}
        </div>

        {healthData?.healthCondition === 'diabetes' && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4">Diabetes Metrics</h4>
            {renderProgressBar('Fiber (g)', completedFiber, totalFiber, 'bg-indigo-500')}
            {renderProgressBar('Carbohydrates (g)', completedCarbs, 150, 'bg-indigo-500')}
            {renderProgressBar('Added Sugar (g)', Math.round(completedCarbs * 0.1), 25, 'bg-rose-400')}
          </div>
        )}
        
        {healthData?.healthCondition === 'ckd' && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4">Renal Metrics</h4>
            {renderProgressBar('Protein (g)', completedProtein, 60, 'bg-indigo-500')}
            {renderProgressBar('Sodium (mg)', Math.round(completedCalories * 0.8), 1500, 'bg-rose-400')}
            {renderProgressBar('Potassium (mg)', Math.round(completedCalories * 1.2), 2000, 'bg-amber-400')}
          </div>
        )}

        {healthData?.healthCondition === 'cardiovascular' && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-4">Cardio Metrics</h4>
            {renderProgressBar('Sodium (mg)', Math.round(completedCalories * 0.8), 1500, 'bg-indigo-500')}
            {renderProgressBar('Saturated Fat (g)', Math.round(completedCalories * 0.01), 15, 'bg-rose-400')}
            {renderProgressBar('Fiber (g)', completedFiber, totalFiber, 'bg-indigo-500')}
          </div>
        )}

        {(!healthData?.healthCondition || healthData.healthCondition === 'general') && (
          <div className="bg-gray-50 rounded-xl p-5 flex flex-col justify-center items-center text-center border border-gray-100">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Planned vs Actual</h4>
            <p className="text-sm text-gray-500 max-w-xs">
              Actual intake will appear here as you log meals in the Food Logger.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyProgress;
