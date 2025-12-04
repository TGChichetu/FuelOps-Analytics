import React, { useState } from 'react';
import { Transaction, FuelType } from '../types';
import { PlusCircle, Search } from 'lucide-react';

interface SalesLogProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id' | 'timestamp'>) => void;
}

export const SalesLog: React.FC<SalesLogProps> = ({ transactions, onAddTransaction }) => {
  const [filter, setFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Form State
  const [pumpId, setPumpId] = useState(1);
  const [fuelType, setFuelType] = useState<FuelType>(FuelType.Petrol95);
  const [liters, setLiters] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      pumpId,
      fuelType,
      liters: Number(liters),
      amount: Number(amount),
    });
    setIsFormOpen(false);
    setLiters('');
    setAmount('');
  };

  const filtered = transactions.filter(t => 
    t.fuelType.toLowerCase().includes(filter.toLowerCase()) || 
    t.id.includes(filter)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
         <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales Log</h2>
          <p className="text-slate-500 text-sm mt-1">Detailed transaction history</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors shadow-sm"
        >
          <PlusCircle size={16} className="mr-2" />
          New Sale
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 animate-in fade-in slide-in-from-top-4">
          <h3 className="font-bold text-slate-800 mb-4">Record Manual Transaction</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Pump ID</label>
               <select 
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                 value={pumpId}
                 onChange={e => setPumpId(Number(e.target.value))}
               >
                 {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>Pump #{n}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Fuel Type</label>
               <select 
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                 value={fuelType}
                 onChange={e => setFuelType(e.target.value as FuelType)}
               >
                 {Object.values(FuelType).map(f => <option key={f} value={f}>{f}</option>)}
               </select>
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Liters</label>
               <input 
                 type="number" 
                 step="0.01" 
                 required
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                 placeholder="0.00"
                 value={liters}
                 onChange={e => setLiters(e.target.value)}
               />
             </div>
             <div>
               <label className="block text-xs font-semibold text-slate-500 mb-1">Amount ($)</label>
               <input 
                 type="number" 
                 step="0.01" 
                 required
                 className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                 placeholder="0.00"
                 value={amount}
                 onChange={e => setAmount(e.target.value)}
               />
             </div>
             <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-emerald-600 text-white p-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Save</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 bg-slate-100 text-slate-600 p-2 rounded-lg text-sm font-medium hover:bg-slate-200">Cancel</button>
             </div>
          </form>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Search by ID or Fuel Type..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Pump</th>
              <th className="px-6 py-4">Fuel</th>
              <th className="px-6 py-4 text-right">Volume</th>
              <th className="px-6 py-4 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-3 font-mono text-xs text-slate-500">{t.id}</td>
                <td className="px-6 py-3 text-slate-700">{new Date(t.timestamp).toLocaleString()}</td>
                <td className="px-6 py-3 text-slate-900 font-medium">#{t.pumpId}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                    ${t.fuelType.includes('Diesel') ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                    {t.fuelType}
                  </span>
                </td>
                <td className="px-6 py-3 text-right text-slate-600">{t.liters.toFixed(2)} L</td>
                <td className="px-6 py-3 text-right font-bold text-slate-800">${t.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
           <div className="p-8 text-center text-slate-500">No transactions found matching your search.</div>
        )}
      </div>
    </div>
  );
};