import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TelemetryData } from '../pages/Index';
import { useState, useEffect } from 'react';

interface TelemetryChartsProps {
  telemetryData: TelemetryData | null;
}

interface ChartDataPoint {
  time: string;
  temperature: number;
  voltage: number;
  altitude: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  rotZ: number;
}

export const TelemetryCharts = ({ telemetryData }: TelemetryChartsProps) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    if (telemetryData) {
      const newDataPoint: ChartDataPoint = {
        time: new Date().toLocaleTimeString(),
        temperature: parseFloat(telemetryData.Temperature) || 0,
        voltage: parseFloat(telemetryData.Voltage) || 0,
        altitude: parseFloat(telemetryData.Altitude) || 0,
        pressure: parseFloat(telemetryData.Pressure) || 0,
        tiltX: parseFloat(telemetryData.TiltX) || 0,
        tiltY: parseFloat(telemetryData.TiltY) || 0,
        rotZ: parseFloat(telemetryData.RotZ) || 0,
      };

      setChartData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only last 20 data points for smooth visualization
        return updated.slice(-20);
      });
    }
  }, [telemetryData]);

  const getCurrentValue = (field: keyof ChartDataPoint) => {
    if (chartData.length === 0) return 0;
    return chartData[chartData.length - 1][field];
  };

  const chartConfig = [
    {
      title: 'Temperature (°C)',
      value: getCurrentValue('temperature'),
      dataKey: 'temperature',
      color: '#3b82f6',
      unit: '°C'
    },
    {
      title: 'Voltage (V)',
      value: getCurrentValue('voltage'),
      dataKey: 'voltage',
      color: '#10b981',
      unit: 'V'
    },
    {
      title: 'Altitude (m)',
      value: getCurrentValue('altitude'),
      dataKey: 'altitude',
      color: '#8b5cf6',
      unit: 'm'
    },
    {
      title: 'Pressure (kPa)',
      value: getCurrentValue('pressure'),
      dataKey: 'pressure',
      color: '#06b6d4',
      unit: 'kPa'
    },
    {
      title: 'Tilt X & Y (°)',
      value: getCurrentValue('tiltX'),
      dataKey: 'tiltX',
      color: '#f59e0b',
      unit: '°',
      secondaryDataKey: 'tiltY'
    },
    {
      title: 'Rotation Z (°/s)',
      value: getCurrentValue('rotZ'),
      dataKey: 'rotZ',
      color: '#ef4444',
      unit: '°/s'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Interactive Graphs</h2>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
            {chartData.length} data points
          </div>
          <div className="px-3 py-1 bg-green-600 text-white text-sm rounded-full">
            Live Updates
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {chartConfig.slice(0, 4).map((config) => (
          <div key={config.title} className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">{config.title.split(' ')[0]} Trend</span>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }}></div>
            </div>
            <div className="text-2xl font-bold text-white">
              {typeof config.value === 'number' ? config.value.toFixed(1) : '0.0'}
            </div>
            <div className="text-xs text-slate-400">{config.unit}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {chartConfig.map((config) => (
          <div key={config.title} className="bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: config.color }}></div>
                <h3 className="text-white font-medium">{config.title}</h3>
              </div>
              <span className="text-slate-400 text-sm">
                {typeof config.value === 'number' ? config.value.toFixed(2) : '0.00'} {config.unit}
              </span>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => value.split(':').slice(1).join(':')}
                  />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Line
                    type="monotone"
                    dataKey={config.dataKey}
                    stroke={config.color}
                    strokeWidth={2}
                    dot={{ fill: config.color, r: 3 }}
                    activeDot={{ r: 5, fill: config.color }}
                  />
                  {config.secondaryDataKey && (
                    <Line
                      type="monotone"
                      dataKey={config.secondaryDataKey}
                      stroke="#f97316"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "#f97316", r: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
