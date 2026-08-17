import React from 'react';
import type { NutritionSummary } from '../types/user';

const BMICard: React.FC<{ summary: NutritionSummary }> = ({ summary }) => {
  const getBmiColor = (category: string) => {
    switch (category) {
      case 'Underweight': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Normal': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Overweight': return 'text-orange-500 bg-orange-50 border-orange-100';
      case 'Obese': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getBmiPosition = (bmi: number) => {
    const clamped = Math.max(15, Math.min(40, bmi));
    return `${((clamped - 15) / 25) * 100}%`;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center h-full">
      <h3 className="text-gray-500 text-sm font-bold mb-4 uppercase tracking-wider">Body Mass Index (BMI)</h3>
      <div className="flex items-end justify-between mb-8 mt-2">
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-extrabold text-gray-900 tracking-tight">{summary.bmi}</span>
          <span className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase border ${getBmiColor(summary.bmiCategory)}`}>
            {summary.bmiCategory}
          </span>
        </div>
      </div>
      
      <div className="relative w-full h-3 rounded-full overflow-hidden flex mb-2">
        <div className="h-full bg-amber-300" style={{ width: '14%' }}></div>
        <div className="h-full bg-emerald-400" style={{ width: '26%' }}></div>
        <div className="h-full bg-orange-400" style={{ width: '20%' }}></div>
        <div className="h-full bg-rose-500" style={{ width: '40%' }}></div>
      </div>
      <div className="relative w-full h-4">
        <div 
          className="absolute top-0 w-3.5 h-3.5 bg-gray-800 rotate-45 transform -translate-x-1/2 -translate-y-1/2 shadow-md rounded-sm border-2 border-white"
          style={{ left: getBmiPosition(summary.bmi) }}
        ></div>
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 font-bold px-1 mt-1">
        <span>15</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>
    </div>
  );
};

export default BMICard;
