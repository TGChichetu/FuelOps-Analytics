import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { SalesLog } from './components/SalesLog';
import { AIAssistant } from './components/AIAssistant';
import { AppState, FuelType, Tank, Transaction, Alert } from './types';

// Initial Mock Data
const INITIAL_TANKS: Tank[] = [
  { id: 't1', name: 'Tank 1 (Main)', fuelType: FuelType.Petrol95, capacity: 45000, currentLevel: 32000, lastDipReading: 32100, lastDipTime: new Date().toISOString(), threshold: 5000 },
  { id: 't2', name: 'Tank 2 (Aux)', fuelType: FuelType.Petrol93, capacity: 30000, currentLevel: 8400, lastDipReading: 8500, lastDipTime: new Date().toISOString(), threshold: 3000 },
  { id: 't3', name: 'Tank 3 (Diesel)', fuelType: FuelType.Diesel50, capacity: 45000, currentLevel: 41000, lastDipReading: 41200, lastDipTime: new Date().toISOString(), threshold: 5000 },
  { id: 't4', name: 'Tank 4 (Truck Stop)', fuelType: FuelType.Diesel500, capacity: 60000, currentLevel: 12000, lastDipReading: 12000, lastDipTime: new Date().toISOString(), threshold: 8000 },
];

const INITIAL_TRANSACTIONS: Transaction[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `TRX-${1000 + i}`,
  timestamp: new Date(Date.now() - i * 1000 * 60 * 45).toISOString(), // Spread over last few hours
  fuelType: i % 3 === 0 ? FuelType.Diesel50 : FuelType.Petrol95,
  liters: Math.random() * 50 + 10,
  amount: (Math.random() * 50 + 10) * 1.5, // Rough price calc
  pumpId: Math.floor(Math.random() * 8) + 1
}));

const INITIAL_ALERTS: Alert[] = [
  { id: 'a1', type: 'critical', message: 'Tank 2 (Petrol 93) approaching reorder level.', timestamp: new Date().toISOString(), acknowledged: false },
  { id: 'a2', type: 'warning', message: 'Pump #4 offline: Sensor timeout.', timestamp: new Date(Date.now() - 3600000).toISOString(), acknowledged: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appState, setAppState] = useState<AppState>({
    tanks: INITIAL_TANKS,
    transactions: INITIAL_TRANSACTIONS,
    alerts: INITIAL_ALERTS
  });

  // Handler to add a new transaction (from Sales Log or simulated)
  const addTransaction = (t: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTrx: Transaction = {
      ...t,
      id: `TRX-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString()
    };
    
    // Also update tank levels
    const updatedTanks = appState.tanks.map(tank => {
      if (tank.fuelType === t.fuelType) {
        return { ...tank, currentLevel: Math.max(0, tank.currentLevel - t.liters) };
      }
      return tank;
    });

    setAppState(prev => ({
      ...prev,
      tanks: updatedTanks,
      transactions: [newTrx, ...prev.transactions]
    }));
  };

  // Handler for manual dip readings
  const updateTankLevel = (tankId: string, newLevel: number) => {
    setAppState(prev => ({
      ...prev,
      tanks: prev.tanks.map(t => t.id === tankId ? { ...t, currentLevel: newLevel, lastDipReading: newLevel, lastDipTime: new Date().toISOString() } : t)
    }));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard state={appState} />;
      case 'inventory':
        return <Inventory tanks={appState.tanks} onAddDip={updateTankLevel} />;
      case 'sales':
        return <SalesLog transactions={appState.transactions} onAddTransaction={addTransaction} />;
      case 'assistant':
        return <AIAssistant state={appState} />;
      default:
        return <Dashboard state={appState} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-slate-900 text-white flex justify-between items-center sticky top-0 z-40">
          <span className="font-bold text-lg">FuelOps Analytics</span>
          <div className="text-xs bg-slate-800 px-2 py-1 rounded">Menu below</div>
        </div>

        {renderContent()}
      </main>
    </div>
  );
}