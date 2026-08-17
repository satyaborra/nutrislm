import React from 'react';
import type { Meal } from '../types/diet';

interface DietPlanCardProps {
  meal: Meal;
  title: string;
  icon: React.ReactNode;
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({ meal, title, icon }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{title}</h4>
          <p className="text-xs font-bold text-emerald-600 line-clamp-1">{meal.name}</p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 font-medium mb-5 line-clamp-2">{meal.description}</p>
      
      <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center mt-auto">
        <div className="text-center bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
          <p className="font-extrabold text-emerald-600 text-sm tracking-tight">{meal.calories}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">kcal</p>
        </div>
        <div className="flex gap-2 text-center h-full items-center">
          <div className="px-3 border-r border-gray-200">
            <p className="font-bold text-gray-800 text-sm">{meal.macros.protein}g</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pro</p>
          </div>
          <div className="px-3 border-r border-gray-200">
            <p className="font-bold text-gray-800 text-sm">{meal.macros.carbs}g</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Carb</p>
          </div>
          <div className="pl-3 pr-1">
            <p className="font-bold text-gray-800 text-sm">{meal.macros.fat}g</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fat</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanCard;
