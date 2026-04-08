// Initial Seed Data based on spreadsheet analysis
const defaultData = [
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
  { id: 13, type: 'tdc', concept: 'MSI Xbox Jaimin', amount: 932, quincena: 2 }
];

let transactions = [];
let currentQuincena = 1;

// Elements
const totalBalanceEl = document.getElementById('total-balance');
const tabBtns = document.querySelectorAll('.tab-btn');
const fabAdd = document.getElementById('fab-add');
const addModal = document.getElementById('add-modal');
const closeModal = document.getElementById('close-modal');
const addForm = document.getElementById('add-form');
const quincenaView = document.getElementById('quincena-view');
const dashboardView = document.getElementById('dashboard-view');

const lists = {
  ingresos: document.getElementById('list-ingresos'),
  ahorros: document.getElementById('list-ahorros'),
  bills: document.getElementById('list-bills'),
  tdc: document.getElementById('list-tdc')
};

const sums = {
  ingresos: document.getElementById('sum-ingresos'),
  ahorros: document.getElementById('sum-ahorros'),
  bills: document.getElementById('sum-bills'),
  tdc: document.getElementById('sum-tdc')
};

const icons = {
  ingresos: 'fa-arrow-down income',
  ahorros: 'fa-piggy-bank expense',
  bills: 'fa-file-invoice-dollar expense',
  tdc: 'fa-credit-card expense'
};

// Initialize
function init() {
  const savedData = localStorage.getItem('budgetData');
  if (savedData) {
    transactions = JSON.parse(savedData);
  } else {
    transactions = [...defaultData];
    saveData();
  }
  
  setupListeners();
  renderApp();
}

function saveData() {
  localStorage.setItem('budgetData', JSON.stringify(transactions));
}

function setupListeners() {
  // Tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tabBtns.forEach(b => b.classList.remove('active'));
      const target = e.target;
      target.classList.add('active');
      const qVal = target.getAttribute('data-q');
      
      if (qVal === 'dashboard') {
        quincenaView.classList.add('hidden');
        dashboardView.classList.remove('hidden');
        renderDashboard();
      } else {
        quincenaView.classList.remove('hidden');
        dashboardView.classList.add('hidden');
        currentQuincena = parseInt(qVal);
        // Adding brief animation trigger
        document.querySelectorAll('.category-section').forEach(el => {
          el.style.animation = 'none';
          el.offsetHeight; /* trigger reflow */
          el.style.animation = null; 
        });
        renderApp();
      }
    });
  });

  // Modal
  fabAdd.addEventListener('click', () => { addModal.classList.remove('hidden'); });
  closeModal.addEventListener('click', () => { addModal.classList.add('hidden'); });
  
  // Submit Form
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tipo = document.getElementById('input-tipo').value;
    const concepto = document.getElementById('input-concepto').value;
    const monto = parseFloat(document.getElementById('input-monto').value);
    const quincena = parseInt(document.querySelector('input[name="input-quincena"]:checked').value);

    const newTx = {
      id: Date.now(),
      type: tipo,
      concept: concepto,
      amount: monto,
      quincena: quincena
    };

    transactions.push(newTx);
    saveData();
    addModal.classList.add('hidden');
    addForm.reset();
    
    // Switch to the tab where the transaction was added (if it's a quincena view)
    const tabEl = document.querySelector(`.tab-btn[data-q="${quincena}"]`);
    if(tabEl) tabEl.click();
  });
}

function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  saveData();
  renderApp();
}

function formatMoney(amount) {
  return '$' + amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderApp() {
  // Filter by quincena
  const qData = transactions.filter(t => t.quincena === currentQuincena);
  
  let totalIngresos = 0;
  let totalGastos = 0;

  // Clear lists
  Object.keys(lists).forEach(k => lists[k].innerHTML = '');
  let categorySums = { ingresos: 0, ahorros: 0, bills: 0, tdc: 0 };

  // Render items
  qData.forEach(item => {
    categorySums[item.type] += item.amount;
    if (item.type === 'ingresos') {
      totalIngresos += item.amount;
    } else {
      totalGastos += item.amount;
    }

    const div = document.createElement('div');
    div.className = 'transaction-item';
    div.innerHTML = `
      <div class="item-info">
        <div class="item-icon ${icons[item.type].includes('income') ? 'income' : 'expense'}">
          <i class="fas ${icons[item.type].split(' ')[0]}"></i>
        </div>
        <div class="item-details">
          <p>${item.concept}</p>
          <span>Quincena ${item.quincena}</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap: 10px;">
        <div class="item-amount">${item.type === 'ingresos' ? '+' : '-'}${formatMoney(item.amount)}</div>
        <button class="delete-btn" onclick="deleteTransaction(${item.id})"><i class="fas fa-trash-alt"></i></button>
      </div>
    `;
    lists[item.type].appendChild(div);
  });

  // Render empty states
  Object.keys(lists).forEach(k => {
    if (lists[k].children.length === 0) {
      lists[k].innerHTML = '<div style="text-align:center; padding:10px; color:var(--text-secondary); font-size:0.9rem;">Sin movimientos</div>';
    }
    // Update sums
    sums[k].innerText = (k === 'ingresos' ? '+' : '-') + formatMoney(categorySums[k]);
  });

  // Calculate and display total balance for this Quincena
  const bal = totalIngresos - totalGastos;
  totalBalanceEl.innerText = formatMoney(bal);
  if (bal > 0) {
    totalBalanceEl.className = 'positive';
  } else if (bal < 0) {
    totalBalanceEl.className = 'negative';
  } else {
    totalBalanceEl.className = '';
  }
  
  // Siempre actualizar el dashboard internamente por si está la vista activa
  renderDashboard();
}

function renderDashboard() {
  let totalIngresos = 0;
  let totalAhorros = 0;
  let totalBills = 0;
  let totalTdc = 0;

  transactions.forEach(t => {
    if (t.type === 'ingresos') totalIngresos += t.amount;
    else if (t.type === 'ahorros') totalAhorros += t.amount;
    else if (t.type === 'bills') totalBills += t.amount;
    else if (t.type === 'tdc') totalTdc += t.amount;
  });

  const totalGastos = totalAhorros + totalBills + totalTdc;
  const balanceNeto = totalIngresos - totalGastos;
  
  const dashBalanceEl = document.getElementById('dash-balance');
  if (!dashBalanceEl) return;
  dashBalanceEl.innerText = formatMoney(balanceNeto);
  
  if (balanceNeto > 0) dashBalanceEl.className = 'positive';
  else if (balanceNeto < 0) dashBalanceEl.className = 'negative';
  else dashBalanceEl.className = '';

  const getPct = (val) => totalIngresos > 0 ? ((val / totalIngresos) * 100).toFixed(1) : 0;
  
  const pctAhorros = getPct(totalAhorros);
  const pctBills = getPct(totalBills);
  const pctTdc = getPct(totalTdc);

  document.getElementById('dash-pct-ahorros').innerText = pctAhorros + '%';
  document.getElementById('dash-bar-ahorros').style.width = Math.min(pctAhorros, 100) + '%';

  document.getElementById('dash-pct-bills').innerText = pctBills + '%';
  document.getElementById('dash-bar-bills').style.width = Math.min(pctBills, 100) + '%';

  document.getElementById('dash-pct-tdc').innerText = pctTdc + '%';
  document.getElementById('dash-bar-tdc').style.width = Math.min(pctTdc, 100) + '%';
}

// Ensure functions are global for inline HTML handlers like onclick
window.deleteTransaction = deleteTransaction;

// Boot
init();
