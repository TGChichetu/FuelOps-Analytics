export enum FuelType {
  Petrol95 = 'Petrol 95',
  Petrol93 = 'Petrol 93',
  Diesel50 = 'Diesel 50ppm',
  Diesel500 = 'Diesel 500ppm'
}

export interface Tank {
  id: string;
  name: string;
  fuelType: FuelType;
  capacity: number; // in Liters
  currentLevel: number; // in Liters
  lastDipReading: number; // in Liters
  lastDipTime: string; // ISO Date
  threshold: number; // Reorder point
}

export interface Transaction {
  id: string;
  timestamp: string;
  fuelType: FuelType;
  liters: number;
  amount: number; // Currency
  pumpId: number;
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface DailySummary {
  date: string;
  totalLiters: number;
  totalRevenue: number;
  transactionsCount: number;
}

export interface AppState {
  tanks: Tank[];
  transactions: Transaction[];
  alerts: Alert[];
}