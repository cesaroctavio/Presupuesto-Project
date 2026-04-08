import { ICONS, formatMoney } from '../data'

export default function TransactionItem({ item, onDelete }) {
  const iconInfo = ICONS[item.type]
  const isIncome = item.type === 'ingresos'

  return (
    <div className="transaction-item">
      <div className="item-info">
        <div className={`item-icon ${iconInfo.variant}`}>
          <i className={`fas ${iconInfo.icon}`}></i>
        </div>
        <div className="item-details">
          <p>{item.concept}</p>
          <span>Quincena {item.quincena}</span>
        </div>
      </div>
      <div className="item-right">
        <div className="item-amount">
          {isIncome ? '+' : '-'}{formatMoney(item.amount)}
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(item.id)}
          aria-label={`Eliminar ${item.concept}`}
          id={`delete-${item.id}`}
        >
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  )
}
