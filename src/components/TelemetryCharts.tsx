
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '../pages/Index';
import { useState } from 'react';

interface TelemetryChartsProps {
  chartData: ChartDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur border border-slate-600 rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 text-sm mb-2">{`Time: ${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const TelemetryCharts = ({ chartData }: TelemetryChartsProps) => {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  const getCurrentValue = (field: keyof ChartDataPoint) => {
    if (chartData.length === 0) return 0;
    return chartData[chartData.length - 1][field];
  };

  const getMinMaxValues = (field: keyof ChartDataPoint) => {
    if (chartData.length === 0) return { min: 0, max: 0 };
    const values = chartData.map(point => point[field] as number);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const chartConfig = [
    {
      title: 'Temperature (°C)',
      value: getCurrentValue('temperature'),
      dataKey: 'temperature',
      color: '#3b82f6',
      unit: '°C',
      id: 'temperature'
    },
    {
      title: 'Voltage (V)',
      value: getCurrentValue('voltage'),
      dataKey: 'voltage',
      color: '#10b981',
      unit: 'V',
      id: 'voltage'
    },
    {
      title: 'Altitude (m)',
      value: getCurrentValue('altitude'),
      dataKey: 'altitude',
      color: '#8b5cf6',
      unit: 'm',
      id: 'altitude'
    },
    {
      title: 'Pressure (kPa)',
      value: getCurrentValue('pressure'),
      dataKey: 'pressure',
      color: '#06b6d4',
      unit: 'kPa',
      id: 'pressure'
    },
    {
      title: 'Tilt X & Y (°)',
      value: getCurrentValue('tiltX'),
      dataKey: 'tiltX',
      color: '#f59e0b',
      unit: '°',
      secondaryDataKey: 'tiltY',
      id: 'tilt'
    },
    {
      title: 'Rotation Z (°/s)',
      value: getCurrentValue('rotZ'),
      dataKey: 'rotZ',
      color: '#ef4444',
      unit: '°/s',
      id: 'rotation'
    }
  ];

  const formatXAxisTick = (tickItem: string) => {
    return tickItem.split(':').slice(1).join(':');
  };

  const getDomain = () => {
    if (chartData.length === 0) return ['dataMin', 'dataMax'];
    const now = Date.now();
    const sixtySecondsAgo = now - 60000;
    return [sixtySecondsAgo, now];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Interactive Graphs</h2>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-blue-700 text-white text-sm rounded-full">
            {chartData.length} data points
          </div>
          <div className="px-3 py-1 bg-green-700 text-white text-sm rounded-full">
            Live Updates (60s window)
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {chartConfig.slice(0, 4).map((config) => {
          const { min, max } = getMinMaxValues(config.dataKey as keyof ChartDataPoint);
          return (
            <div 
              key={config.title} 
              className={`bg-slate-900/50 backdrop-blur border border-slate-600 rounded-lg p-4 transition-all duration-200 hover:bg-slate-800/50 cursor-pointer ${
                selectedChart === config.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedChart(selectedChart === config.id ? null : config.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 text-sm">{config.title.split(' ')[0]} Trend</span>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></div>
              </div>
              <div className="text-2xl font-bold text-white">
                {typeof config.value === 'number' ? config.value.toFixed(1) : '0.0'}
              </div>
              <div className="text-xs text-slate-400">{config.unit}</div>
              <div className="text-xs text-slate-500 mt-1">
                Min: {min.toFixed(1)} | Max: {max.toFixed(1)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {chartConfig.map((config) => {
          const { min, max } = getMinMaxValues(config.dataKey as keyof ChartDataPoint);
          const isSelected = selectedChart === config.id;
          
          return (
            <div 
              key={config.title} 
              className={`bg-slate-900/40 backdrop-blur border border-slate-600 rounded-lg p-6 transition-all duration-200 hover:bg-slate-800/40 ${
                isSelected ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></div>
                  <h3 className="text-white font-medium">{config.title}</h3>
                </div>
                <span className="text-slate-300 text-sm">
                  {typeof config.value === 'number' ? config.value.toFixed(2) : '0.00'} {config.unit}
                </span>
              </div>
              
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#9ca3af"
                      fontSize={10}
                      tickFormatter={formatXAxisTick}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={10}
                      domain={['dataMin - 1', 'dataMax + 1']}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    
                    {/* Add reference lines for min/max */}
                    <ReferenceLine 
                      y={max} 
                      stroke={config.color} 
                      strokeDasharray="2 2" 
                      opacity={0.5}
                      label={{ value: `Max: ${max.toFixed(1)}`, position: "top", fontSize: 10 }}
                    />
                    <ReferenceLine 
                      y={min} 
                      stroke={config.color} 
                      strokeDasharray="2 2" 
                      opacity={0.5}
                      label={{ value: `Min: ${min.toFixed(1)}`, position: "bottom", fontSize: 10 }}
                    />
                    
                    <Line
                      type="monotone"
                      dataKey={config.dataKey}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={{ fill: config.color, r: 2 }}
                      activeDot={{ r: 5, fill: config.color, stroke: '#fff', strokeWidth: 2 }}
                      connectNulls={false}
                    />
                    {config.secondaryDataKey && (
                      <Line
                        type="monotone"
                        dataKey={config.secondaryDataKey}
                        stroke="#f97316"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#f97316", r: 2 }}
                        activeDot={{ r: 5, fill: "#f97316", stroke: '#fff', strokeWidth: 2 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>60s window</span>
                <span>{chartData.length} points</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
