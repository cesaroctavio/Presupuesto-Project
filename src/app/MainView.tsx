'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import CategorySection from '../components/CategorySection';
import TransactionModal from '../components/TransactionModal';
import Dashboard from '../components/Dashboard';
import { addTransaction, updateTransaction, deleteTransaction, setBudget } from '../actions/transactionActions';

const CATEGORIES = ['ingresos', 'ahorros', 'bills', 'tdc'];

export default function MainView({ initialTransactions, budgets, activeMonthYear }: { initialTransactions: any[], budgets: any[], activeMonthYear: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('1');
  const [modalState, setModalState] = useState<{isOpen: boolean, data?: any}>({ isOpen: false });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Optimistic UI for smooth UX
  const [transactions, setTransactions] = useState(initialTransactions);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMonthChange = (newMonthYear: string) => {
    router.push(`/?monthYear=${newMonthYear}`);
  };

  const handleSaveTransaction = async (data: any) => {
    // Destructure id out so we don't send it in the insert/update payload
    const { id, ...saveData } = data;

    if (id) {
      // Edit
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      await updateTransaction(id, saveData);
    } else {
      // Add
      const tempId = Date.now() % 1000000; // Small temporary id to avoid React key collisions before refresh
      const newTx = { ...saveData, id: tempId, monthYear: activeMonthYear };
      setTransactions(prev => [...prev, newTx]);
      setActiveTab(String(saveData.quincena));
      await addTransaction({ ...saveData, monthYear: activeMonthYear });
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      setTransactions(prev => prev.filter(t => t.id !== id));
      await deleteTransaction(id);
    }
  };

  const handleSetBudget = async (category: string, amount: number) => {
    await setBudget(category, amount, activeMonthYear);
    router.refresh();
  };

  const currentQ = activeTab === 'dashboard' ? null : parseInt(activeTab);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (currentQ) {
      result = result.filter(t => t.quincena === currentQ);
    }
    if (searchQuery) {
      result = result.filter(t => t.concept.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [transactions, currentQ, searchQuery]);

  const balance = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'ingresos').reduce((s, t) => s + t.amount, 0);
    const expenses = filteredTransactions.filter(t => t.type !== 'ingresos').reduce((s, t) => s + t.amount, 0);
    return income - expenses;
  }, [filteredTransactions]);

  const grouped = useMemo(() => {
    const g: Record<string, any[]> = {};
    CATEGORIES.forEach(c => { g[c] = [] });
    filteredTransactions.forEach(item => {
      if (g[item.type]) g[item.type].push(item);
    });
    return g;
  }, [filteredTransactions]);

  const isDashboard = activeTab === 'dashboard';

  return (
    <div className="app-container">
      <header className="main-header glass-panel">
        <Header 
          balance={isDashboard ? 0 : balance} 
          activeMonthYear={activeMonthYear} 
          onMonthChange={handleMonthChange}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      </header>

      <main className="content-area">
        {isDashboard ? (
          <Dashboard transactions={transactions} budgets={budgets} onUpdateBudget={handleSetBudget} />
        ) : (
          <div id="quincena-view">
            {CATEGORIES.map(cat => (
              <CategorySection
                key={cat}
                type={cat}
                items={grouped[cat]}
                budget={budgets.find(b => b.category === cat)}
                onDelete={handleDelete}
                onEdit={(item: any) => setModalState({ isOpen: true, data: item })}
              />
            ))}
          </div>
        )}
        <div className="bottom-spacer"></div>
      </main>

      <button
        className="fab"
        onClick={() => setModalState({ isOpen: true, data: null })}
        id="fab-add"
        aria-label="Agregar movimiento"
      >
        <i className="fas fa-plus"></i>
      </button>

      <TransactionModal
        isOpen={modalState.isOpen}
        initialData={modalState.data}
        onClose={() => setModalState({ isOpen: false })}
        onSave={handleSaveTransaction}
        defaultQuincena={currentQ || 1}
      />
    </div>
  );
}
