import React from 'react';
import { Tank, FuelType } from '../types';
import { AlertTriangle, TrendingDown, Plus } from 'lucide-react';

interface InventoryProps {
  tanks: Tank[];
  onAddDip: (tankId: string, level: number) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ tanks, onAddDip }) => {
  const getFuelColor = (type: FuelType) => {
    switch (type) {
      case FuelType.Petrol95: return 'bg-emerald-500';
      case FuelType.Petrol93: return 'bg-teal-500';
      case FuelType.Diesel50: return 'bg-blue-600';
      case FuelType.Diesel500: return 'bg-indigo-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Fuel Inventory</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time tank monitoring and dip readings</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" />
          Log Bulk Delivery
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {tanks.map(tank => {
          const percentage = Math.round((tank.currentLevel / tank.capacity) * 100);
          const isLow = percentage < 20;
          
          return (
            <div key={tank.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden">
              {isLow && (
                <div className="absolute top-0 right-0 p-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle size={12} className="mr-1" /> Low Stock
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{tank.name}</h3>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{tank.fuelType}</span>
                </div>
              </div>

              <div className="flex items-end space-x-4 mb-6">
                <div className="flex-1 h-32 bg-slate-100 rounded-lg relative overflow-hidden">
                  <div 
                    className={`absolute bottom-0 left-0 right-0 w-full transition-all duration-1000 ${getFuelColor(tank.fuelType)}`}
                    style={{ height: `${percentage}%` }}
                  >
                     <div className="absolute top-0 left-0 right-0 h-1 bg-white/20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{percentage}%</div>
                  <div className="text-sm text-slate-500">{tank.currentLevel.toLocaleString()} L</div>
                  <div className="text-xs text-slate-400">of {tank.capacity.toLocaleString()} L</div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Last Dip</span>
                  <span className="font-medium text-slate-700">{new Date(tank.lastDipTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="mt-3">
                  <button 
                    onClick={() => {
                      const newLevel = prompt(`Enter new dip reading for ${tank.name} (Current: ${tank.currentLevel})`);
                      if (newLevel && !isNaN(Number(newLevel))) {
                        onAddDip(tank.id, Number(newLevel));
                      }
                    }}
                    className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200 transition-colors flex items-center justify-center"
                  >
                    <TrendingDown size={14} className="mr-2" />
                    Record Dip
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start space-x-3">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
          <AlertTriangle size={20} />
        </div>
        <div>
           <h4 className="font-semibold text-blue-900">Inventory Insight</h4>
           <p className="text-sm text-blue-800 mt-1">
             Diesel 50ppm (Tank 3) consumption rate is 15% higher than typical Tuesdays. Consider scheduling an early refill if trends continue.
           </p>
        </div>
      </div>
    </div>
  );
};