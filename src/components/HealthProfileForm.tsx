import React from 'react';
import type { HealthMetrics } from '../types/user';

interface Props {
  data: HealthMetrics;
  onChange: (data: HealthMetrics) => void;
}

const HealthProfileForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (field: keyof HealthMetrics, value: string | number) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-5">
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4">Personal Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
          <input type="number" value={data.age} onChange={e => handleChange('age', Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
          <select value={data.gender} onChange={e => handleChange('gender', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 cursor-pointer">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Height (cm)</label>
          <input type="number" value={data.heightCm} onChange={e => handleChange('heightCm', Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weight (kg)</label>
          <input type="number" value={data.weightKg} onChange={e => handleChange('weightKg', Number(e.target.value))} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Level</label>
          <select value={data.activityLevel} onChange={e => handleChange('activityLevel', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 cursor-pointer">
            <option value="sedentary">Sedentary (little to no exercise)</option>
            <option value="lightly_active">Lightly Active (1-3 days/week)</option>
            <option value="moderately_active">Moderately Active (3-5 days/week)</option>
            <option value="very_active">Very Active (6-7 days/week)</option>
            <option value="extra_active">Extra Active (physical job/2x day)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Health Goal</label>
          <select value={data.healthGoal} onChange={e => handleChange('healthGoal', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all font-medium text-gray-800 cursor-pointer">
            <option value="Weight Loss">Weight Loss</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Weight Gain">Weight Gain</option>
            <option value="Muscle Gain">Muscle Gain</option>
          </select>
        </div>
      </div>
      
      <div className="pt-3">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Select Health Condition</label>
        <p className="text-xs text-gray-500 mb-4">This customizes your clinical tracking dashboard and insights.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div 
            onClick={() => handleChange('healthCondition', 'general')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.healthCondition === 'general' || !data.healthCondition ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
          >
            <h4 className={`font-bold text-lg ${data.healthCondition === 'general' || !data.healthCondition ? 'text-emerald-700' : 'text-gray-800'}`}>General</h4>
            <p className="text-sm font-medium text-gray-500 mt-1">No Specific Condition</p>
          </div>

          <div 
            onClick={() => handleChange('healthCondition', 'diabetes')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.healthCondition === 'diabetes' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
          >
            <h4 className={`font-bold text-lg ${data.healthCondition === 'diabetes' ? 'text-emerald-700' : 'text-gray-800'}`}>Type 2 Diabetes</h4>
            <p className="text-sm font-medium text-gray-500 mt-1">Glucose & Diet</p>
          </div>

          <div 
            onClick={() => handleChange('healthCondition', 'ckd')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.healthCondition === 'ckd' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
          >
            <h4 className={`font-bold text-lg ${data.healthCondition === 'ckd' ? 'text-emerald-700' : 'text-gray-800'}`}>CKD</h4>
            <p className="text-sm font-medium text-gray-500 mt-1">Kidney Care</p>
          </div>

          <div 
            onClick={() => handleChange('healthCondition', 'cardiovascular')}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${data.healthCondition === 'cardiovascular' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-emerald-200'}`}
          >
            <h4 className={`font-bold text-lg ${data.healthCondition === 'cardiovascular' ? 'text-emerald-700' : 'text-gray-800'}`}>Cardiovascular</h4>
            <p className="text-sm font-medium text-gray-500 mt-1">Heart Health</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HealthProfileForm;
