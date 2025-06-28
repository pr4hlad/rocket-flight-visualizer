import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { ChartDataPoint } from '../pages/Index';
import { useState } from 'react';
import { Button } from './ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface TelemetryChartsProps {
  chartData: ChartDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface ZoomState {
  left: number;
  right: number;
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
  const [zoomState, setZoomState] = useState<ZoomState | null>(null);

  // Filter data to show only the last 5 seconds
  const getFilteredData = () => {
    if (chartData.length === 0) return [];
    
    const now = Date.now();
    const fiveSecondsAgo = now - 5000; // 5 seconds in milliseconds
    
    return chartData.filter(point => point.timestamp > fiveSecondsAgo);
  };

  const filteredData = getFilteredData();

  // Get data based on zoom state
  const getDisplayData = () => {
    if (!zoomState || filteredData.length === 0) return filteredData;
    
    const totalDataPoints = filteredData.length;
    const leftIndex = Math.floor((zoomState.left / 100) * totalDataPoints);
    const rightIndex = Math.floor((zoomState.right / 100) * totalDataPoints);
    
    return filteredData.slice(leftIndex, rightIndex + 1);
  };

  const displayData = getDisplayData();

  const getCurrentValue = (field: keyof ChartDataPoint) => {
    if (filteredData.length === 0) return 0;
    return filteredData[filteredData.length - 1][field];
  };

  const getMinMaxValues = (field: keyof ChartDataPoint) => {
    if (displayData.length === 0) return { min: 0, max: 0 };
    const values = displayData.map(point => point[field] as number);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  // Zoom handlers
  const handleZoomIn = () => {
    if (!zoomState) {
      setZoomState({ left: 25, right: 75 });
    } else {
      const center = (zoomState.left + zoomState.right) / 2;
      const range = (zoomState.right - zoomState.left) / 2;
      const newRange = Math.max(range * 0.7, 5); // Minimum 5% range
      setZoomState({
        left: Math.max(center - newRange, 0),
        right: Math.min(center + newRange, 100)
      });
    }
  };

  const handleZoomOut = () => {
    if (!zoomState) return;
    
    const center = (zoomState.left + zoomState.right) / 2;
    const range = (zoomState.right - zoomState.left) / 2;
    const newRange = Math.min(range * 1.4, 50); // Maximum 100% range
    
    const newLeft = Math.max(center - newRange, 0);
    const newRight = Math.min(center + newRange, 100);
    
    if (newLeft <= 0 && newRight >= 100) {
      setZoomState(null);
    } else {
      setZoomState({ left: newLeft, right: newRight });
    }
  };

  const handleZoomReset = () => {
    setZoomState(null);
  };

  const handleMouseWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
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

  const getTimeRangeText = () => {
    if (!zoomState) return '5s window';
    const range = zoomState.right - zoomState.left;
    const seconds = Math.round((range / 100) * 5);
    return `${seconds}s window`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Interactive Graphs</h2>
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={!zoomState}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomReset}
              disabled={!zoomState}
              className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          <div className="px-3 py-1 bg-blue-700 text-white text-sm rounded-full">
            {displayData.length} data points
          </div>
          <div className="px-3 py-1 bg-green-700 text-white text-sm rounded-full">
            Live Updates ({getTimeRangeText()})
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
              
              <div 
                className="h-48 cursor-crosshair"
                onWheel={handleMouseWheel}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={displayData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                <span>{getTimeRangeText()} {zoomState && `(${zoomState.left.toFixed(0)}-${zoomState.right.toFixed(0)}%)`}</span>
                <span>{displayData.length} points</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
