import React from 'react';

export type MealCategory = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

interface Props {
  active: MealCategory;
  onChange: (c: MealCategory) => void;
}

const MealCategoryTabs: React.FC<Props> = ({ active, onChange }) => {
  const categories: MealCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <div className="flex space-x-1 sm:space-x-2 bg-gray-50/80 dark:bg-slate-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-slate-800 overflow-x-auto w-full hide-scrollbar transition-colors duration-300">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all duration-300 whitespace-nowrap ${
            active === cat 
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-gray-200/60 dark:border-slate-700 ring-1 ring-emerald-500/10' 
              : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100/80 dark:hover:bg-slate-800/80 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default MealCategoryTabs;
