import React from 'react';
import { useHealth } from '../../contexts/HealthContext';
import { Activity } from 'lucide-react';

const DiseaseNutritionFocus: React.FC = () => {
  const { healthData } = useHealth();
  
  if (!healthData || healthData.healthCondition === 'general' || !healthData.healthCondition) {
    return null;
  }

  const renderDiabetes = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Carbohydrates</span>
        <span className="text-sm font-bold text-indigo-700">140 / 150 g</span>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Fiber</span>
        <span className="text-sm font-bold text-indigo-700">28 / 30 g</span>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Added Sugar</span>
        <span className="text-sm font-bold text-indigo-700">8 / 25 g</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Target
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Glycemic Load</span>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Moderate</span>
      </div>
    </div>
  );

  const renderCKD = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Protein</span>
        <span className="text-sm font-bold text-indigo-700">48 / 60 g</span>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Sodium</span>
        <span className="text-sm font-bold text-indigo-700">1,120 mg</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Tracked Value
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Potassium</span>
        <span className="text-sm font-bold text-indigo-700">1,650 mg</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Tracked Value
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Phosphorus</span>
        <span className="text-sm font-bold text-indigo-700">620 mg</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Tracked Value
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Fluid</span>
        <span className="text-sm font-bold text-indigo-700">1.4 / 1.5 L</span>
      </div>
    </div>
  );

  const renderCVD = () => (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Sodium</span>
        <span className="text-sm font-bold text-indigo-700">1,400 mg</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Tracked Value
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2 relative group cursor-help">
        <span className="text-sm font-medium text-indigo-900">Sat. Fat</span>
        <span className="text-sm font-bold text-indigo-700">12 g</span>
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Demo Tracked Value
        </div>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Fiber</span>
        <span className="text-sm font-bold text-indigo-700">28 / 30 g</span>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Cholesterol</span>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Low</span>
      </div>
      <div className="flex justify-between items-center border-b border-indigo-100/50 pb-2">
        <span className="text-sm font-medium text-indigo-900">Omega-3</span>
        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Good</span>
      </div>
    </div>
  );

  return (
    <div className="bg-indigo-50/30 rounded-2xl p-5 border border-indigo-100 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-5 w-5 text-indigo-600" />
        <h3 className="text-base font-bold text-indigo-900">
          {healthData.healthCondition === 'diabetes' && 'Diabetes Nutrition Focus'}
          {healthData.healthCondition === 'ckd' && 'Renal Nutrition Focus'}
          {healthData.healthCondition === 'cardiovascular' && 'Cardiovascular Nutrition Focus'}
        </h3>
      </div>
      {healthData.healthCondition === 'diabetes' && renderDiabetes()}
      {healthData.healthCondition === 'ckd' && renderCKD()}
      {healthData.healthCondition === 'cardiovascular' && renderCVD()}
    </div>
  );
};

export default DiseaseNutritionFocus;
