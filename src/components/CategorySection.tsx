import React from 'react';
import { CATEGORY_LABELS, formatMoney } from '../data';
import TransactionItem from './TransactionItem';
import { AlertTriangle } from 'lucide-react';

export default function CategorySection({ type, items, budget, onDelete, onEdit }: any) {
  const label = CATEGORY_LABELS[type as keyof typeof CATEGORY_LABELS];
  const isIncome = type === 'ingresos';
  const total = items.reduce((sum: number, i: any) => sum + i.amount, 0);

  const isOverBudget = !isIncome && budget && total > (budget.amount || 0);

  return (
    <section className="category-section">
      <div className={`section-header ${isOverBudget ? 'border-red-500/50 relative' : ''}`}>
        <div className="flex items-center gap-2">
          <h3 className={isOverBudget ? 'text-red-400' : ''}>{label}</h3>
          {isOverBudget && <AlertTriangle size={16} className="text-red-500" />}
        </div>
        <div className="flex flex-col items-end">
          <span className={isIncome ? 'sum-positive' : 'sum-negative'}>
            {isIncome ? '+' : '-'}{formatMoney(total)}
          </span>
          {budget && !isIncome && (
            <span className="text-xs text-gray-400">
              Meta: {formatMoney(budget.amount)}
            </span>
          )}
        </div>
      </div>
      <div className="list-container">
        {items.length === 0 ? (
          <div className="empty-state">Sin movimientos</div>
        ) : (
          items.map((item: any) => (
            <TransactionItem key={item.id} item={item} onDelete={onDelete} onEdit={onEdit} />
          ))
        )}
      </div>
    </section>
  );
}
