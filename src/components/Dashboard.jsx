import { formatMoney } from '../data'

export default function Dashboard({ transactions }) {
  let totalIngresos = 0
  let totalAhorros = 0
  let totalBills = 0
  let totalTdc = 0

  transactions.forEach(t => {
    if (t.type === 'ingresos') totalIngresos += t.amount
    else if (t.type === 'ahorros') totalAhorros += t.amount
    else if (t.type === 'bills') totalBills += t.amount
    else if (t.type === 'tdc') totalTdc += t.amount
  })

  const totalGastos = totalAhorros + totalBills + totalTdc
  const balanceNeto = totalIngresos - totalGastos
  const balanceClass = balanceNeto > 0 ? 'positive' : balanceNeto < 0 ? 'negative' : ''

  const getPct = (val) =>
    totalIngresos > 0 ? ((val / totalIngresos) * 100).toFixed(1) : '0.0'

  const pctAhorros = getPct(totalAhorros)
  const pctBills = getPct(totalBills)
  const pctTdc = getPct(totalTdc)

  const bars = [
    { label: 'Ahorros e Inversión', pct: pctAhorros, barClass: 'income' },
    { label: 'Bills Fijos', pct: pctBills, barClass: 'expense' },
    { label: 'TDC y Suscripciones', pct: pctTdc, barClass: 'negative-alert' },
  ]

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

      <section className="category-section">
        <div className="section-header">
          <h3>Distribución de Dinero</h3>
        </div>
        <div className="distribution-panel">
          {bars.map((bar, idx) => (
            <div className="dist-row" key={idx}>
              <div className="dist-label">
                <span>{bar.label}</span>
                <span>{bar.pct}%</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className={`progress-bar-fill ${bar.barClass}`}
                  style={{ width: `${Math.min(parseFloat(bar.pct), 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
