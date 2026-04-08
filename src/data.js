export const ICONS = {
  ingresos: { icon: 'fa-arrow-down', variant: 'income' },
  ahorros: { icon: 'fa-piggy-bank', variant: 'expense' },
  bills: { icon: 'fa-file-invoice-dollar', variant: 'expense' },
  tdc: { icon: 'fa-credit-card', variant: 'expense' },
}

export const CATEGORY_LABELS = {
  ingresos: 'Ingresos',
  ahorros: 'Ahorros',
  bills: 'Bills (Fijos)',
  tdc: 'TDC y Suscripciones',
}

export const DEFAULT_DATA = [
  { id: 1, type: 'ingresos', concept: 'Quincena', amount: 23000, quincena: 1 },
  { id: 2, type: 'ingresos', concept: 'Quincena', amount: 23000, quincena: 2 },
  { id: 3, type: 'ahorros', concept: 'Inversión Fija', amount: 3000, quincena: 1 },
  { id: 4, type: 'ahorros', concept: 'Fondo Emergencia', amount: 2000, quincena: 2 },
  { id: 5, type: 'bills', concept: 'Renta', amount: 8000, quincena: 1 },
  { id: 6, type: 'bills', concept: 'Luz', amount: 500, quincena: 1 },
  { id: 7, type: 'bills', concept: 'Mandado', amount: 2000, quincena: 1 },
  { id: 8, type: 'bills', concept: 'Mandado', amount: 2000, quincena: 2 },
  { id: 9, type: 'tdc', concept: 'NU 15 c/mes', amount: 2300, quincena: 1 },
  { id: 10, type: 'tdc', concept: 'Hey Banco', amount: 8700, quincena: 2 },
  { id: 11, type: 'tdc', concept: 'Netflix', amount: 318, quincena: 1 },
  { id: 12, type: 'tdc', concept: 'Spotify', amount: 199, quincena: 1 },
  { id: 13, type: 'tdc', concept: 'MSI Xbox Jaimin', amount: 932, quincena: 2 },
]

export function formatMoney(amount) {
  return '$' + amount.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
