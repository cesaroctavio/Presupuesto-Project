import React, { useState } from 'react';
import { formatMoney } from '../data';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Header({ balance, activeMonthYear, onMonthChange, searchQuery, onSearch }: any) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : '';

  // Parse month year string e.g. "04-2026"
  const [mStr, yStr] = activeMonthYear.split('-');
  const dateObj = new Date(parseInt(yStr), parseInt(mStr) - 1);
  const monthName = dateObj.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const shiftMonth = (delta: number) => {
    const nd = new Date(dateObj);
    nd.setMonth(nd.getMonth() + delta);
    const newStr = `${String(nd.getMonth() + 1).padStart(2, '0')}-${nd.getFullYear()}`;
    onMonthChange(newStr);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between items-center w-full mt-2">
        <h1 className="greeting !mb-0">Mi Presupuesto</h1>
        <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="text-gray-400 hover:text-white transition">
           <Search size={22} />
        </button>
      </div>

      {isSearchOpen && (
        <div className="w-full relative fade-in">
           <input 
             type="text" 
             placeholder="Buscar gastos..." 
             className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-blue-500"
             value={searchQuery}
             onChange={(e) => onSearch(e.target.value)}
             autoFocus
           />
        </div>
      )}

      {/* Month Selector */}
      <div className="flex justify-between items-center bg-black/40 rounded-xl px-4 py-3">
        <button onClick={() => shiftMonth(-1)} className="text-gray-400 hover:text-white p-1">
          <ChevronLeft size={20} />
        </button>
        <div className="font-semibold text-lg capitalize tracking-wide">{monthName}</div>
        <button onClick={() => shiftMonth(1)} className="text-gray-400 hover:text-white p-1">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="balance-card mt-2">
        <p>Balance Disponible</p>
        <h2 id="total-balance" className={balanceClass}>
          {formatMoney(balance)}
        </h2>
      </div>
    </div>
  );
}
