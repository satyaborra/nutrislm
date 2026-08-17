import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const getCommonOptions = (isDark: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(17, 24, 39, 0.9)',
      padding: 12,
      titleFont: { size: 13, family: 'inherit' },
      bodyFont: { size: 14, family: 'inherit', weight: 'bold' as const },
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: { color: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' },
      border: { display: false },
      ticks: { color: isDark ? '#94a3b8' : '#64748b' }
    },
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: { color: isDark ? '#94a3b8' : '#64748b' }
    }
  }
});

export const WeightProgressChart: React.FC = () => {
  const { isDark } = useTheme();
  
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [75, 74.2, 73.5, 72.8, 72.1, 71.5],
        borderColor: '#6366f1',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0.0)');
          return gradient;
        },
        borderWidth: 3,
        pointBackgroundColor: isDark ? '#1e293b' : '#fff',
        pointBorderColor: '#6366f1',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return <div className="h-64 mt-4"><Line data={data} options={getCommonOptions(isDark)} /></div>;
};

export const CalorieConsumptionChart: React.FC = () => {
  const { isDark } = useTheme();
  
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calories Consumed',
        data: [2100, 1950, 2050, 2200, 1900, 2300, 2000],
        backgroundColor: '#10b981',
        borderRadius: 6,
        barPercentage: 0.6,
      },
      {
        label: 'Target',
        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        type: 'line' as const,
        borderColor: '#f43f5e',
        borderWidth: 2,
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
      }
    ]
  };

  const baseOptions = getCommonOptions(isDark);
  const optionsWithLegend = {
    ...baseOptions,
    scales: {
      ...baseOptions.scales,
      y: { ...baseOptions.scales.y, beginAtZero: true }
    },
    plugins: {
      ...baseOptions.plugins,
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: { 
          usePointStyle: true, 
          padding: 20, 
          font: { family: 'inherit', size: 12, weight: 'bold' as const },
          color: isDark ? '#e2e8f0' : '#475569'
        }
      }
    }
  };

  return <div className="h-64 mt-4"><Bar data={data as any} options={optionsWithLegend as any} /></div>;
};
