import React from 'react';
import { Flame } from 'lucide-react';
import type { NutritionSummary } from '../types/user';

const CalorieSummaryCard: React.FC<{ summary: NutritionSummary }> = ({ summary }) => {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 md:p-8 rounded-2xl shadow-lg text-white h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-6 opacity-90">
          <Flame className="h-5 w-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Daily Energy Needs</h3>
        </div>
        
        <div className="mb-8">
          <p className="text-emerald-100 text-sm font-semibold mb-2">Target Calories</p>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-extrabold tracking-tight">{summary.dailyCalorieRequirement}</span>
            <span className="text-emerald-100 font-semibold text-lg">kcal</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 border-t border-emerald-500/50 pt-5 mt-auto">
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-50 font-medium tracking-wide">Basal Metabolic Rate (BMR)</span>
          <span className="font-bold text-base">{summary.bmr} kcal</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-50 font-medium tracking-wide">Maintenance Level</span>
          <span className="font-bold text-base">{summary.maintenanceCalories} kcal</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-50 font-medium tracking-wide">Weight Loss Deficit</span>
          <span className="font-bold text-emerald-200 text-base">{Math.max(1200, summary.maintenanceCalories - 500)} kcal</span>
        </div>
      </div>
    </div>
  );
};

export default CalorieSummaryCard;
