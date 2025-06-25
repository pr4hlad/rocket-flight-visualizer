
import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { TelemetryCharts } from '../components/TelemetryCharts';
import { TelemetryTable } from '../components/TelemetryTable';
import { StatusHeader } from '../components/StatusHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

export interface TelemetryData {
  Team_Id: string;
  TimeStamp: string;
  PacketCount: string;
  Altitude: string;
  Pressure: string;
  Temperature: string;
  Voltage: string;
  GpsTime: string;
  GpsLatitude: string;
  GpsLongitude: string;
  GpsAltitude: string;
  GpsSats: string;
  a_x: string;
  a_y: string;
  a_z: string;
  gyro_x: string;
  gyro_y: string;
  gyro_z: string;
  FSW_State: string;
  AngleX: string;
  AngleY: string;
  AngleZ: string;
  TiltX: string;
  TiltY: string;
  RotZ: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'telemetry' | 'graphs'>('graphs');
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchTelemetryData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/telemetry');
      if (response.ok) {
        const data = await response.json();
        if (Object.keys(data).length > 0) {
          setTelemetryData(data);
          setIsConnected(true);
          setLastUpdate(new Date());
          console.log('Telemetry data received:', data);
        }
      } else {
        setIsConnected(false);
        console.error('Failed to fetch telemetry data');
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Error fetching telemetry data:', error);
    }
  };

  useEffect(() => {
    // Fetch data immediately
    fetchTelemetryData();
    
    // Set up interval for live updates every 2 seconds
    const interval = setInterval(fetchTelemetryData, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 flex flex-col">
          <StatusHeader 
            isConnected={isConnected}
            lastUpdate={lastUpdate}
            telemetryData={telemetryData}
          />
          
          <div className="flex-1 p-6">
            {activeTab === 'graphs' ? (
              <TelemetryCharts telemetryData={telemetryData} />
            ) : (
              <TelemetryTable telemetryData={telemetryData} />
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
