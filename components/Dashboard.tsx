import React, { useMemo } from 'react';
import { AppState } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { DollarSign, Droplets, Activity, AlertCircle } from 'lucide-react';

interface DashboardProps {
  state: AppState;
}

export const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  // Aggregate data for charts
  const salesData = useMemo(() => {
    // Group transactions by simple time buckets for demo
    // In a real app, this would be robust date aggregation
    const grouped = new Map();
    state.transactions.slice().reverse().forEach(t => {
      const time = new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const existing = grouped.get(time) || { time, amount: 0, liters: 0 };
      grouped.set(time, { 
        time, 
        amount: existing.amount + t.amount,
        liters: existing.liters + t.liters 
      });
    });
    return Array.from(grouped.values()).slice(-10); // Last 10 points
  }, [state.transactions]);

  const totalRevenue = state.transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalVolume = state.transactions.reduce((acc, t) => acc + t.liters, 0);
  const criticalAlerts = state.alerts.filter(a => a.type === 'critical').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Operational Overview</h2>
        <p className="text-slate-500 text-sm mt-1">Today's metrics and real-time activity</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12.5%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-sm text-slate-500 mt-1">Total Revenue</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Droplets size={20} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">+5.2%</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{totalVolume.toLocaleString()} L</div>
          <div className="text-sm text-slate-500 mt-1">Volume Sold</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-xs font-medium text-slate-500">Active</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">8 / 12</div>
          <div className="text-sm text-slate-500 mt-1">Pumps Active</div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg">
              <AlertCircle size={20} />
            </div>
            {criticalAlerts > 0 && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded animate-pulse">Action Req.</span>}
          </div>
          <div className="text-3xl font-bold text-slate-900">{state.alerts.length}</div>
          <div className="text-sm text-slate-500 mt-1">System Alerts</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Revenue Trend (Today)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} prefix="$" />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tank Status Overview (Mini) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-6">Current Stock Levels</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={state.tanks} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#334155', fontWeight: 500}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="currentLevel" radius={[0, 4, 4, 0]} barSize={24}>
                  {state.tanks.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.currentLevel / entry.capacity < 0.2 ? '#ef4444' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Pump</th>
                <th className="px-6 py-3">Fuel Type</th>
                <th className="px-6 py-3 text-right">Liters</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.transactions.slice(0, 5).map(t => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 text-slate-600">
                    {new Date(t.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-3 text-slate-900 font-medium">#{t.pumpId}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800">
                      {t.fuelType}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right text-slate-600">{t.liters.toFixed(2)} L</td>
                  <td className="px-6 py-3 text-right font-medium text-emerald-600">${t.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};