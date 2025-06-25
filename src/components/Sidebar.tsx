
import { Rocket, BarChart3, Radio, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: 'telemetry' | 'graphs';
  onTabChange: (tab: 'telemetry' | 'graphs') => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className="w-64 bg-slate-800/90 backdrop-blur border-r border-slate-700 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">CanSat Telemetry</h1>
            <p className="text-slate-400 text-sm">Mission Control Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          <h2 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Tabs
          </h2>
          
          <Button
            variant={activeTab === 'telemetry' ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 ${
              activeTab === 'telemetry'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => onTabChange('telemetry')}
          >
            <Radio className="w-4 h-4" />
            Telemetry
          </Button>
          
          <Button
            variant={activeTab === 'graphs' ? 'default' : 'ghost'}
            className={`w-full justify-start gap-3 ${
              activeTab === 'graphs'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            onClick={() => onTabChange('graphs')}
          >
            <BarChart3 className="w-4 h-4" />
            Graphs
          </Button>
        </div>

        {/* Live Data Status */}
        <div className="mt-6 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Live Data</span>
          </div>
          <p className="text-slate-400 text-xs">Updates every 2 seconds</p>
        </div>
      </div>
    </div>
  );
};
