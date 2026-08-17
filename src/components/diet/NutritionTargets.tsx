import React from 'react';

interface NutritionTargetsProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const NutritionTargets: React.FC<NutritionTargetsProps> = ({ totalCalories, totalProtein, totalCarbs, totalFat }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Today's Targets</h2>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-100 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Calories</span>
          <span className="text-xl font-bold">{totalCalories} <span className="text-xs">kcal</span></span>
        </div>
        
        <div className="bg-gray-50 text-gray-800 p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Protein</span>
          <span className="text-xl font-bold">{totalProtein} <span className="text-xs">g</span></span>
        </div>
        
        <div className="bg-gray-50 text-gray-800 p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Carbs</span>
          <span className="text-xl font-bold">{totalCarbs} <span className="text-xs">g</span></span>
        </div>
        
        <div className="bg-gray-50 text-gray-800 p-4 rounded-xl border border-gray-100 flex flex-col justify-center">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Fat</span>
          <span className="text-xl font-bold">{totalFat} <span className="text-xs">g</span></span>
        </div>
        
        <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-100 flex flex-col justify-center relative overflow-hidden group">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Fiber</span>
          <span className="text-xl font-bold">30 <span className="text-xs">g</span></span>
          <div className="absolute inset-0 bg-white/90 items-center justify-center text-[10px] font-bold text-amber-900 text-center opacity-0 group-hover:opacity-100 transition-opacity flex p-2">
            Demo Target
          </div>
        </div>
        
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex flex-col justify-center relative overflow-hidden group">
          <span className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">Water</span>
          <span className="text-xl font-bold">2.0 <span className="text-xs">L</span></span>
          <div className="absolute inset-0 bg-white/90 items-center justify-center text-[10px] font-bold text-blue-900 text-center opacity-0 group-hover:opacity-100 transition-opacity flex p-2">
            Demo Target
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionTargets;
