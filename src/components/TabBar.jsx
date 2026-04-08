const TABS = [
  { key: '1', label: 'Quincena 1' },
  { key: '2', label: 'Quincena 2' },
  { key: 'dashboard', label: 'Mes' },
]

export default function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="tabs">
      {TABS.map(tab => (
        <button
          key={tab.key}
          className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
          onClick={() => onTabChange(tab.key)}
          id={`tab-${tab.key}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
