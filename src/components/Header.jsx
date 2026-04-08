import { formatMoney } from '../data'

export default function Header({ balance }) {
  const balanceClass = balance > 0 ? 'positive' : balance < 0 ? 'negative' : ''

  return (
    <div>
      <h1 className="greeting">Mi Presupuesto</h1>
      <div className="balance-card">
        <p>Balance Disponible</p>
        <h2 id="total-balance" className={balanceClass}>
          {formatMoney(balance)}
        </h2>
      </div>
    </div>
  )
}
