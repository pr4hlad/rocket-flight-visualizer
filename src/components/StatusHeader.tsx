
import { Clock, Wifi, WifiOff, Satellite } from 'lucide-react';
import { TelemetryData } from '../pages/Index';

interface StatusHeaderProps {
  isConnected: boolean;
  lastUpdate: Date | null;
  telemetryData: TelemetryData | null;
}

export const StatusHeader = ({ isConnected, lastUpdate, telemetryData }: StatusHeaderProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-blue-600/20 backdrop-blur border-b border-blue-500/30 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-medium">Flight</span>
            <span className="text-white font-mono">LAUNCH_WAIT</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-medium">Team ID</span>
            <span className="text-white font-mono">
              {telemetryData?.Team_Id || '2024-ASI-CANSAT-020'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {isConnected ? (
              <>
                <Wifi className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Disconnected</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Satellite className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Packets: </span>
            <span className="text-white font-mono">
              {telemetryData?.PacketCount || '00000'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm">Mission Time</span>
            <span className="text-white font-mono">
              {lastUpdate ? formatTime(lastUpdate) : '--:--:--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
