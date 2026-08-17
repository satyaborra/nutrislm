import React, { useState } from 'react';
import { User, Search, LogOut, ChevronDown, Cpu, Cloud, Lock, Settings } from 'lucide-react';
import ThemeToggleButton from './ThemeToggleButton';
import NotificationsDropdown from './NotificationsDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { processingMode, setProcessingMode, capabilityState } = useAI();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getModeIcon = () => {
    if (processingMode === 'offline') return <Lock className="w-4 h-4 text-emerald-500" />;
    if (processingMode === 'online') return <Cloud className="w-4 h-4 text-blue-500" />;
    return <Cpu className="w-4 h-4 text-indigo-500" />;
  };

  const getModeLabel = () => {
    if (processingMode === 'offline') return 'Offline';
    if (processingMode === 'online') return 'Online';
    return 'Auto';
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="NutriSLM Logo" className="h-8 w-8 object-contain" />
        <h1 className="text-xl font-bold text-emerald-600 hidden md:block">NutriSLM</h1>
      </div>
      
      <div className="flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Search healthy recipes, insights..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all dark:text-slate-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        
        {/* AI Mode Toggle */}
        <div className="relative hidden sm:block">
          <button 
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-full border border-gray-200 dark:border-slate-600 transition-colors"
          >
            {getModeIcon()}
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{getModeLabel()}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          
          {showModeDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700 mb-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">AI Processing Mode</p>
                {capabilityState === 'OFFLINE_READY' ? (
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1"><Lock className="w-3 h-3"/> Local Models Installed</p>
                ) : capabilityState === 'OFFLINE_MODEL_MISSING' ? (
                  <p className="text-[10px] text-rose-500 font-semibold flex items-center gap-1"><Settings className="w-3 h-3"/> Local Models Missing</p>
                ) : (
                  <p className="text-[10px] text-blue-500 font-semibold flex items-center gap-1"><Cloud className="w-3 h-3"/> Cloud Ready</p>
                )}
              </div>
              
              <button onClick={() => { setProcessingMode('auto'); setShowModeDropdown(false); }} className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 ${processingMode === 'auto' ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                <div className="flex items-center gap-2">
                  <Cpu className={`w-4 h-4 ${processingMode === 'auto' ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${processingMode === 'auto' ? 'text-indigo-700 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>Auto</p>
                    <p className="text-[10px] text-gray-500">Prefers local, falls back to cloud</p>
                  </div>
                </div>
              </button>
              
              <button onClick={() => { setProcessingMode('online'); setShowModeDropdown(false); }} className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 ${processingMode === 'online' ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                <div className="flex items-center gap-2">
                  <Cloud className={`w-4 h-4 ${processingMode === 'online' ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${processingMode === 'online' ? 'text-blue-700 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>Online Mode</p>
                    <p className="text-[10px] text-gray-500">Uses cloud VLM/SLM APIs</p>
                  </div>
                </div>
              </button>
              
              <button onClick={() => { setProcessingMode('offline'); setShowModeDropdown(false); }} className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 ${processingMode === 'offline' ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''}`}>
                <div className="flex items-center gap-2">
                  <Lock className={`w-4 h-4 ${processingMode === 'offline' ? 'text-emerald-500' : 'text-gray-400'}`} />
                  <div>
                    <p className={`text-sm font-semibold ${processingMode === 'offline' ? 'text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>Offline Privacy</p>
                    <p className="text-[10px] text-gray-500">Force local processing only</p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        <ThemeToggleButton />
        <NotificationsDropdown />
        {isAuthenticated && (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-slate-700 p-1 pr-2 rounded-full transition-colors"
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-emerald-200 dark:border-emerald-800" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
