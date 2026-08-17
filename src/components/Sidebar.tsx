import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Utensils, Calendar, Activity, MessageSquare, User } from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Utensils, label: 'Food Logger', path: '/logger' },
  { icon: Calendar, label: 'Diet Plan', path: '/diet' },
  { icon: Activity, label: 'Health Tracker', path: '/health' },
  { icon: MessageSquare, label: 'AI Assistant', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: User, label: 'Health Profile (V3)', path: '/health-profile' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-800 border-r border-gray-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 hidden md:flex transition-colors duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-slate-700 transition-colors duration-300">
        <img src="/logo.png" alt="NutriSLM Logo" className="h-8 w-8 mr-2 object-contain" />
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500">
          NutriSLM
        </span>
      </div>
      
      <nav className="flex-1 py-6 px-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group border-l-4 ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold border-emerald-500 shadow-sm' 
                    : 'text-gray-600 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-slate-700/50 hover:text-emerald-600 dark:hover:text-emerald-400 border-transparent hover:border-emerald-200 dark:hover:border-slate-500 hover:translate-x-1'
                }`
              }
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 m-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 transition-colors duration-300">
        <h4 className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 mb-1">Go Premium</h4>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-3 block">Unlock advanced AI health insights.</p>
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white text-sm py-2 rounded-lg transition-colors font-medium shadow-sm shadow-emerald-200 dark:shadow-none">
          Upgrade Now
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
