import React, { useState } from 'react';
import { formatMoney, CATEGORY_LABELS } from '../data';
import { Edit3 } from 'lucide-react';

export default function Dashboard({ transactions, budgets, onUpdateBudget }: any) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [budgetInput, setBudgetInput] = useState('');

  let totalIngresos = 0;
  let totalAhorros = 0;
  let totalBills = 0;
  let totalTdc = 0;

  transactions.forEach((t: any) => {
    if (t.type === 'ingresos') totalIngresos += t.amount;
    else if (t.type === 'ahorros') totalAhorros += t.amount;
    else if (t.type === 'bills') totalBills += t.amount;
    else if (t.type === 'tdc') totalTdc += t.amount;
  });

  const totalGastos = totalAhorros + totalBills + totalTdc;
  const balanceNeto = totalIngresos - totalGastos;
  const balanceClass = balanceNeto > 0 ? 'positive' : balanceNeto < 0 ? 'negative' : '';

  const getPct = (val: number) =>
    totalIngresos > 0 ? ((val / totalIngresos) * 100).toFixed(1) : '0.0';

  const pctAhorros = getPct(totalAhorros);
  const pctBills = getPct(totalBills);
  const pctTdc = getPct(totalTdc);

  const getBudgetFor = (cat: string) => budgets?.find((b: any) => b.category === cat)?.amount || 0;

  const bars = [
    { id: 'ahorros', label: 'Ahorros e Inversión', val: totalAhorros, pct: pctAhorros, barClass: 'income', budget: getBudgetFor('ahorros') },
    { id: 'bills', label: 'Bills Fijos', val: totalBills, pct: pctBills, barClass: 'expense', budget: getBudgetFor('bills') },
    { id: 'tdc', label: 'TDC y Suscripciones', val: totalTdc, pct: pctTdc, barClass: 'negative-alert', budget: getBudgetFor('tdc') },
  ];

  const handleSaveBudget = (cat: string) => {
    onUpdateBudget(cat, parseFloat(budgetInput));
    setEditingCategory(null);
  };

  return (
    <div id="dashboard-view">
      <section className="category-section">
        <div className="section-header">
          <h3>Balance Global del Mes</h3>
        </div>
        <div className="dash-balance-card">
          <p>Ahorro neto restante tras pagar todo</p>
          <h2 id="dash-balance" className={balanceClass}>
            {formatMoney(balanceNeto)}
          </h2>
        </div>
      </section>

      <section className="category-section mt-8">
        <div className="section-header">
          <h3>Distribución y Metas</h3>
        </div>
        <div className="distribution-panel space-y-6">
          {bars.map((bar, idx) => {
            const isOver = bar.budget > 0 && bar.val > bar.budget;
            return (
              <div className="dist-row !mb-0" key={idx}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex flex-col">
                    <span className="font-medium">{bar.label}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {editingCategory === bar.id ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-24 bg-black/50 border border-white/20 rounded px-2 py-1 text-xs" 
                            value={budgetInput} 
                            onChange={e => setBudgetInput(e.target.value)} 
                            placeholder="Tope"
                            autoFocus
                          />
                          <button onClick={() => handleSaveBudget(bar.id)} className="text-xs text-blue-400">Guardar</button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingCategory(bar.id); setBudgetInput(bar.budget.toString()); }} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition">
                          Meta: {bar.budget > 0 ? formatMoney(bar.budget) : 'Sin Meta'} <Edit3 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={isOver ? 'text-red-400 font-bold' : ''}>{formatMoney(bar.val)}</span>
                    <span className="text-xs text-gray-400">{bar.pct}% del Ingreso</span>
                  </div>
                </div>
                <div className="progress-bar-bg relative">
                  <div
                    className={`progress-bar-fill ${isOver ? 'negative-alert' : bar.barClass}`}
                    style={{ width: `${Math.min(parseFloat(bar.pct), 100)}%` }}
                  ></div>
                  {bar.budget > 0 && totalIngresos > 0 && (
                    <div 
                      className="absolute top-0 bottom-0 border-l border-red-500 z-10"
                      style={{ left: `${Math.min((bar.budget / totalIngresos) * 100, 100)}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
