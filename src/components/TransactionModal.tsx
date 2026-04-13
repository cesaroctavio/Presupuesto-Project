import React, { useState, useEffect } from 'react';

const TYPES = [
  { value: 'ingresos', label: 'Ingreso' },
  { value: 'ahorros', label: 'Ahorro' },
  { value: 'bills', label: 'Bill Fijo' },
  { value: 'tdc', label: 'TDC / Suscripción' },
];

export default function TransactionModal({ isOpen, onClose, onSave, defaultQuincena, initialData }: any) {
  const [tipo, setTipo] = useState('ingresos');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [quincena, setQuincena] = useState(defaultQuincena);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTipo(initialData.type);
        setConcepto(initialData.concept);
        setMonto(initialData.amount.toString());
        setQuincena(initialData.quincena);
      } else {
        setTipo('ingresos');
        setConcepto('');
        setMonto('');
        setQuincena(defaultQuincena);
      }
    }
  }, [isOpen, initialData, defaultQuincena]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto.trim() || !monto) return;

    onSave({
      id: initialData ? initialData.id : null,
      type: tipo,
      concept: concepto.trim(),
      amount: parseFloat(monto),
      quincena: parseInt(quincena),
    });

    onClose();
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? '' : 'hidden'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      id="add-modal"
    >
      <div className="modal glass-panel">
        <div className="modal-header">
          <h3>{initialData ? 'Editar Movimiento' : 'Nuevo Movimiento'}</h3>
          <button className="close-btn" onClick={onClose} id="close-modal" type="button">
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
                  checked={quincena.toString() === '1'}
                  onChange={() => setQuincena(1)}
                />
                Q1
              </label>
              <label>
                <input
                  type="radio"
                  name="quincena"
                  value="2"
                  checked={quincena.toString() === '2'}
                  onChange={() => setQuincena(2)}
                />
                Q2
              </label>
            </div>
          </div>
          <button type="submit" className="submit-btn" id="submit-transaction">
            {initialData ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      </div>
    </div>
  );
}
