import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import type { LanguageStats } from '../../../types/github';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface LanguageRadarChartProps {
  languages: LanguageStats[];
}

export function LanguageRadarChart({ languages }: LanguageRadarChartProps) {
  const topLanguages = languages.slice(0, 6); // Show top 6 languages

  const data = {
    labels: topLanguages.map(lang => lang.language),
    datasets: [
      {
        label: 'Language Proficiency',
        data: topLanguages.map(lang => lang.proficiency),
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        pointBackgroundColor: topLanguages.map(lang => lang.color),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: topLanguages.map(lang => lang.color),
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed.r}% proficiency`;
          }
        }
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
            weight: '500',
          },
          color: '#374151',
        },
        ticks: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };

  return (
    <div className="h-80 w-full">
      <Radar data={data} options={options} />
    </div>
  );
}