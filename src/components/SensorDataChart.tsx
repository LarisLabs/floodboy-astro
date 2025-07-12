import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  type ChartOptions
} from 'chart.js';
import type { ChartData } from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface SensorDataChartProps {
  storeAddress: string;
  fields: Array<{ name: string; unit: string; dtype: string }>;
  theme: 'light' | 'dark';
  historicalData: Array<{
    timestamp: number;
    sensor: string;
    values: number[];
    block: string;
  }>;
  selectedField: number;
  onFieldChange: (field: number) => void;
}

const formatValue = (value: number, unit: string): string => {
  if (unit.includes('x 1000')) {
    return (value / 1000).toFixed(2);
  }
  if (unit.includes('x 100')) {
    return (value / 100).toFixed(2);
  }
  if (unit.includes('x 10')) {
    return (value / 10).toFixed(1);
  }
  if (unit.includes('°C') || unit.includes('pH')) {
    return (value / 100).toFixed(2);
  }
  if (unit.includes('%')) {
    return (value / 10).toFixed(1);
  }
  return value.toString();
};

const SensorDataChart: React.FC<SensorDataChartProps> = ({ 
  fields, 
  theme, 
  historicalData, 
  selectedField,
  onFieldChange 
}) => {
  const chartRef = useRef<ChartJS<'line', number[], string>>(null);
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  // Update chart data when historical data or selected field changes
  useEffect(() => {
    if (!historicalData || historicalData.length === 0 || !fields[selectedField]) {
      return;
    }

    const field = fields[selectedField];
    const sortedData = [...historicalData].sort((a, b) => a.timestamp - b.timestamp);
    
    const labels = sortedData.map(d => new Date(d.timestamp));
    const data = sortedData.map(d => {
      const value = d.values[selectedField] || 0;
      return parseFloat(formatValue(value, field.unit));
    });

    setChartData({
      labels,
      datasets: [
        {
          label: `${field.name} (${field.unit.split(' ')[0]})`,
          data,
          borderColor: theme === 'dark' ? 'rgb(147, 51, 234)' : 'rgb(124, 58, 237)',
          backgroundColor: theme === 'dark' ? 'rgba(147, 51, 234, 0.1)' : 'rgba(124, 58, 237, 0.1)',
          tension: 0.1,
          pointRadius: 3,
          pointHoverRadius: 5,
          pointBackgroundColor: theme === 'dark' ? 'rgb(147, 51, 234)' : 'rgb(124, 58, 237)',
          pointBorderColor: theme === 'dark' ? 'rgb(147, 51, 234)' : 'rgb(124, 58, 237)',
        }
      ]
    });
  }, [historicalData, selectedField, fields, theme]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#111827',
        bodyColor: theme === 'dark' ? '#d1d5db' : '#374151',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context) => {
            const field = fields[selectedField];
            const value = context.parsed.y;
            return `${field.name}: ${value} ${field.unit.split(' ')[0]}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            hour: 'HH:mm',
            day: 'MMM dd',
          }
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false
        }
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: {
            size: 11
          }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb',
          drawBorder: false
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="space-y-4">
      {/* Field selector */}
      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <button
            key={index}
            onClick={() => onFieldChange(index)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              selectedField === index
                ? 'bg-purple-600 text-white'
                : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {field.name}
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="h-80">
        {historicalData.length > 0 ? (
          <Line ref={chartRef} data={chartData} options={options} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              No data available
            </p>
          </div>
        )}
      </div>

      {/* Data summary */}
      {historicalData.length > 0 && fields[selectedField] && (
        <div className={`grid grid-cols-3 gap-4 p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
        }`}>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Latest Value
            </p>
            <p className={`text-lg font-mono font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatValue(
                historicalData[historicalData.length - 1].values[selectedField] || 0,
                fields[selectedField].unit
              )} {fields[selectedField].unit.split(' ')[0]}
            </p>
          </div>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Data Points
            </p>
            <p className={`text-lg font-mono font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {historicalData.length}
            </p>
          </div>
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Time Range
            </p>
            <p className={`text-lg font-mono font-semibold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {historicalData.length > 1 
                ? `${Math.round((historicalData[historicalData.length - 1].timestamp - historicalData[0].timestamp) / 3600000)}h`
                : '0h'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SensorDataChart;