import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface MacroChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacroChart: React.FC<MacroChartProps> = ({ protein, carbs, fat }) => {
  const total = protein + carbs + fat;

  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [protein, carbs, fat],
        backgroundColor: ['#10b981', '#3b82f6', '#f59e0b'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { 
          padding: 24, 
          font: { family: 'inherit', size: 12, weight: 'bold' as const }, 
          usePointStyle: true 
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        padding: 12,
        titleFont: { size: 13, family: 'inherit' },
        bodyFont: { size: 14, family: 'inherit', weight: 'bold' as const },
        callbacks: {
          label: (context: any) => {
            const raw = context.raw;
            const pct = ((raw / total) * 100).toFixed(0);
            return ` ${context.label}: ${pct}% (${raw}g)`;
          }
        }
      }
    },
    cutout: '40%', // Make it slightly a doughnut for modern look
  };

  return (
    <div className="w-full relative py-2" style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default MacroChart;
