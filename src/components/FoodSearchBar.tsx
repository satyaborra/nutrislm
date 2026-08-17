import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

const FoodSearchBar: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        type="text"
        className="block w-full pl-11 pr-12 py-3.5 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 sm:text-sm font-semibold transition-all shadow-sm text-gray-900 dark:text-slate-100"
        placeholder="Search for any food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit"
        className="absolute inset-y-1.5 right-2 px-2 flex items-center bg-gray-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors border border-gray-200 dark:border-slate-600 hover:border-emerald-200"
      >
        <Plus className="h-4 w-4" />
      </button>
    </form>
  );
};

export default FoodSearchBar;
