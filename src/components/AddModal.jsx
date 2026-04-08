import { useState } from 'react'

const TYPES = [
  { value: 'ingresos', label: 'Ingreso' },
  { value: 'ahorros', label: 'Ahorro' },
  { value: 'bills', label: 'Bill Fijo' },
  { value: 'tdc', label: 'TDC / Suscripción' },
]

export default function AddModal({ isOpen, onClose, onAdd, defaultQuincena }) {
  const [tipo, setTipo] = useState('ingresos')
  const [concepto, setConcepto] = useState('')
  const [monto, setMonto] = useState('')
  const [quincena, setQuincena] = useState(defaultQuincena)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!concepto.trim() || !monto) return

    onAdd({
      id: Date.now(),
      type: tipo,
      concept: concepto.trim(),
      amount: parseFloat(monto),
      quincena: parseInt(quincena),
    })

    // Reset form
    setTipo('ingresos')
    setConcepto('')
    setMonto('')
    setQuincena(defaultQuincena)
    onClose()
  }

  return (
    <div
      className={`modal-overlay ${isOpen ? '' : 'hidden'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      id="add-modal"
    >
      <div className="modal glass-panel">
        <div className="modal-header">
          <h3>Nuevo Movimiento</h3>
          <button className="close-btn" onClick={onClose} id="close-modal">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} id="add-form">
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              id="input-tipo"
              required
            >
              {TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Concepto</label>
            <input
              type="text"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej. Quincena de trabajo"
              id="input-concepto"
              required
            />
          </div>
          <div className="form-group">
            <label>Monto</label>
            <input
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              id="input-monto"
              required
            />
          </div>
          <div className="form-group">
            <label>Asignar a Quincena</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="quincena"
                  value="1"
                  checked={quincena === 1}
                  onChange={() => setQuincena(1)}
                />
                Q1
              </label>
              <label>
                <input
                  type="radio"
                  name="quincena"
                  value="2"
                  checked={quincena === 2}
                  onChange={() => setQuincena(2)}
                />
                Q2
              </label>
            </div>
          </div>
          <button type="submit" className="submit-btn" id="submit-transaction">
            Guardar
          </button>
        </form>
      </div>
    </div>
  )
}
