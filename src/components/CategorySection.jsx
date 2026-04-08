import { CATEGORY_LABELS, formatMoney } from '../data'
import TransactionItem from './TransactionItem'

export default function CategorySection({ type, items, onDelete }) {
  const label = CATEGORY_LABELS[type]
  const isIncome = type === 'ingresos'
  const total = items.reduce((sum, i) => sum + i.amount, 0)

  return (
    <section className="category-section">
      <div className="section-header">
        <h3>{label}</h3>
        <span className={isIncome ? 'sum-positive' : 'sum-negative'}>
          {isIncome ? '+' : '-'}{formatMoney(total)}
        </span>
      </div>
      <div className="list-container">
        {items.length === 0 ? (
          <div className="empty-state">Sin movimientos</div>
        ) : (
          items.map(item => (
            <TransactionItem key={item.id} item={item} onDelete={onDelete} />
          ))
        )}
      </div>
    </section>
  )
}
