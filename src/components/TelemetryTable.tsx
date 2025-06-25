import { TelemetryData } from '../pages/Index';
import { Badge } from '@/components/ui/badge';

interface TelemetryTableProps {
  telemetryData: TelemetryData | null;
}

export const TelemetryTable = ({ telemetryData }: TelemetryTableProps) => {
  const flightDataFields = [
    { key: 'Team_Id', label: 'TEAM ID', value: telemetryData?.Team_Id || 'N/A' },
    { key: 'TimeStamp', label: 'TIMESTAMP', value: telemetryData?.TimeStamp || 'Invalid Date' },
    { key: 'PacketCount', label: 'PACKET #', value: telemetryData?.PacketCount || '00000' },
    { key: 'FSW_State', label: 'MODE', value: telemetryData?.FSW_State || 'L' },
    { key: 'FSW_State', label: 'STATE', value: 'LAUNCH_WAIT' },
    { key: 'Altitude', label: 'ALTITUDE [m]', value: telemetryData?.Altitude || '0.0' },
    { key: 'Pressure', label: 'AIR SPEED [m/s]', value: '0.0' },
    { key: 'Temperature', label: 'TEMP [°C]', value: telemetryData?.Temperature || '0.0' },
    { key: 'Voltage', label: 'VOLTAGE [V]', value: telemetryData?.Voltage || '0.0' },
    { key: 'Pressure', label: 'PRESSURE [kPa]', value: telemetryData?.Pressure || '0.0' },
  ];

  const sensorDataFields = [
    { key: 'GpsTime', label: 'GPS TIME', value: telemetryData?.GpsTime || 'N/A' },
    { key: 'GpsLatitude', label: 'LATITUDE', value: telemetryData?.GpsLatitude || '0.0' },
    { key: 'GpsLongitude', label: 'LONGITUDE', value: telemetryData?.GpsLongitude || '0.0' },
    { key: 'GpsAltitude', label: 'GPS ALT [m]', value: telemetryData?.GpsAltitude || '0.0' },
    { key: 'GpsSats', label: 'SATELLITES', value: telemetryData?.GpsSats || '0' },
    { key: 'a_x', label: 'ACCEL X [g]', value: telemetryData?.a_x || '0.0' },
    { key: 'a_y', label: 'ACCEL Y [g]', value: telemetryData?.a_y || '0.0' },
    { key: 'a_z', label: 'ACCEL Z [g]', value: telemetryData?.a_z || '0.0' },
    { key: 'gyro_x', label: 'GYRO X [°/s]', value: telemetryData?.gyro_x || '0.0' },
    { key: 'gyro_y', label: 'GYRO Y [°/s]', value: telemetryData?.gyro_y || '0.0' },
    { key: 'gyro_z', label: 'GYRO Z [°/s]', value: telemetryData?.gyro_z || '0.0' },
  ];

  const formatValue = (value: string, key: string) => {
    if (key.includes('Latitude') || key.includes('Longitude')) {
      const num = parseFloat(value);
      return !isNaN(num) ? num.toFixed(6) : value;
    }
    if (!isNaN(parseFloat(value)) && value !== 'N/A') {
      return parseFloat(value).toFixed(2);
    }
    return value;
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'LAUNCH_WAIT':
        return 'bg-yellow-500';
      case 'ASCENT':
        return 'bg-green-500';
      case 'DESCENT':
        return 'bg-blue-500';
      case 'LANDED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Telemetry Data</h2>
        <div className="flex gap-2">
          <Badge className="bg-green-700 hover:bg-green-800">Connected</Badge>
          <Badge className="bg-blue-700 hover:bg-blue-800">
            Packets: {telemetryData?.PacketCount || '00000'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Flight Data */}
        <div className="bg-slate-900/40 backdrop-blur border border-slate-600 rounded-lg overflow-hidden">
          <div className="bg-slate-800/60 p-4 border-b border-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <h3 className="text-white font-semibold">Flight Data</h3>
            </div>
          </div>
          
          <div className="p-0">
            <div className="space-y-0">
              {flightDataFields.map((field, index) => (
                <div key={field.key + index} className="flex justify-between items-center p-4 border-b border-slate-600/50 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <span className="text-slate-200 font-medium text-sm">{field.label}</span>
                  <span className="text-white font-mono text-sm">
                    {formatValue(field.value, field.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-800/30 border-t border-slate-600">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400">● Last update: {new Date().toLocaleTimeString()}</span>
              <span className="text-slate-300">FSW State: LAUNCH_WAIT</span>
            </div>
          </div>
        </div>

        {/* Sensor Data */}
        <div className="bg-slate-900/40 backdrop-blur border border-slate-600 rounded-lg overflow-hidden">
          <div className="bg-slate-800/60 p-4 border-b border-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <h3 className="text-white font-semibold">Sensor Data</h3>
            </div>
          </div>
          
          <div className="p-0">
            <div className="space-y-0">
              {sensorDataFields.map((field, index) => (
                <div key={field.key + index} className="flex justify-between items-center p-4 border-b border-slate-600/50 last:border-b-0 hover:bg-slate-800/30 transition-colors">
                  <span className="text-slate-200 font-medium text-sm">{field.label}</span>
                  <span className="text-white font-mono text-sm">
                    {formatValue(field.value, field.key)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-slate-800/30 border-t border-slate-600">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">TEAM: {telemetryData?.Team_Id || '2024-ASI-CANSAT-020'}</span>
              <span className="text-blue-400">GPS Sats: {telemetryData?.GpsSats || '0'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
