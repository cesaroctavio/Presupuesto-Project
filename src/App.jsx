import { useState, useEffect, useCallback, useMemo } from 'react'
import Header from './components/Header'
import TabBar from './components/TabBar'
import CategorySection from './components/CategorySection'
import AddModal from './components/AddModal'
import Dashboard from './components/Dashboard'
import { DEFAULT_DATA } from './data'

const STORAGE_KEY = 'budgetData'
const CATEGORIES = ['ingresos', 'ahorros', 'bills', 'tdc']

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {
    // ignore corrupt data
  }
  return [...DEFAULT_DATA]
}

export default function App() {
  const [transactions, setTransactions] = useState(loadTransactions)
  const [activeTab, setActiveTab] = useState('1')
  const [modalOpen, setModalOpen] = useState(false)
  // Unique key to re-trigger entry animations when changing quincena tabs
  const [animKey, setAnimKey] = useState(0)

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    if (tab !== 'dashboard') {
      setAnimKey(prev => prev + 1)
    }
  }, [])

  const handleAdd = useCallback((newTx) => {
    setTransactions(prev => [...prev, newTx])
    // Switch to the tab where the transaction lives
    setActiveTab(String(newTx.quincena))
    setAnimKey(prev => prev + 1)
  }, [])

  const handleDelete = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  // Current quincena number (1 or 2)
  const currentQ = activeTab === 'dashboard' ? null : parseInt(activeTab)

  // Filtered data for current quincena
  const qData = useMemo(() => {
    if (!currentQ) return []
    return transactions.filter(t => t.quincena === currentQ)
  }, [transactions, currentQ])

  // Balance for current quincena
  const balance = useMemo(() => {
    const income = qData.filter(t => t.type === 'ingresos').reduce((s, t) => s + t.amount, 0)
    const expenses = qData.filter(t => t.type !== 'ingresos').reduce((s, t) => s + t.amount, 0)
    return income - expenses
  }, [qData])

  // Group items by category for current quincena
  const grouped = useMemo(() => {
    const g = {}
    CATEGORIES.forEach(c => { g[c] = [] })
    qData.forEach(item => {
      if (g[item.type]) g[item.type].push(item)
    })
    return g
  }, [qData])

  const isDashboard = activeTab === 'dashboard'

  return (
    <div className="app-container">
      {/* Header */}
      <header className="main-header glass-panel">
        <Header balance={isDashboard ? 0 : balance} />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      {/* Content */}
      <main className="content-area">
        {isDashboard ? (
          <Dashboard transactions={transactions} />
        ) : (
          <div id="quincena-view" key={animKey}>
            {CATEGORIES.map(cat => (
              <CategorySection
                key={cat}
                type={cat}
                items={grouped[cat]}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        <div className="bottom-spacer"></div>
      </main>

      {/* FAB */}
      <button
        className="fab"
        onClick={() => setModalOpen(true)}
        id="fab-add"
        aria-label="Agregar movimiento"
      >
        <i className="fas fa-plus"></i>
      </button>

      {/* Modal */}
      <AddModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAdd}
        defaultQuincena={currentQ || 1}
      />
    </div>
  )
}
