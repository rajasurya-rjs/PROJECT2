// Store expenses in localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingId = null;

// Mock exchange rates (in production, you would fetch from an API)
const exchangeRates = {
    USD: 1,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.25,
    CAD: 1.25,
    AUD: 1.35,
    CNY: 6.45
};

// Convert amount between currencies
function convertAmount(amount, from, to) {
    if (from === to) return amount;
    const toUSD = amount / exchangeRates[from];
    return toUSD * exchangeRates[to];
}

// Format currency
function formatCurrency(amount, currency) {
    return `${currency} ${amount.toFixed(2)}`;
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Calculate total expenses in base currency
function calculateTotal(category = null) {
    const baseCurrency = document.getElementById('baseCurrency').value;
    return expenses.reduce((total, expense) => {
        if (category && expense.category !== category) return total;
        const convertedAmount = convertAmount(expense.amount, expense.currency, baseCurrency);
        return total + convertedAmount;
    }, 0);
}

// Update summary cards
function updateSummary() {
    const baseCurrency = document.getElementById('baseCurrency').value;
    document.getElementById('totalExpenses').textContent = formatCurrency(calculateTotal(), baseCurrency);
    document.getElementById('foodTotal').textContent = formatCurrency(calculateTotal('food'), baseCurrency);
    document.getElementById('transportationTotal').textContent = formatCurrency(calculateTotal('transportation'), baseCurrency);
    document.getElementById('housingTotal').textContent = formatCurrency(calculateTotal('housing'), baseCurrency);
}

// Render expenses list
function renderExpenses() {
    const tbody = document.getElementById('expensesList');
    const baseCurrency = document.getElementById('baseCurrency').value;
    tbody.innerHTML = '';

    expenses.forEach(expense => {
        const tr = document.createElement('tr');
        const convertedAmount = convertAmount(expense.amount, expense.currency, baseCurrency);
        
        tr.innerHTML = `
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.description}</td>
            <td class="capitalize">${expense.category}</td>
            <td>
                ${formatCurrency(expense.amount, expense.currency)}
                ${expense.currency !== baseCurrency ? 
                    `<span class="text-gray-500 text-sm">(${formatCurrency(convertedAmount, baseCurrency)})</span>` : 
                    ''}
            </td>
            <td>
                <button onclick="editExpense('${expense.id}')" class="action-btn edit-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button onclick="deleteExpense('${expense.id}')" class="action-btn delete-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Add/Edit expense
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const amount = Number(document.getElementById('amount').value);
    const currency = document.getElementById('currency').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;

    if (editingId) {
        expenses = expenses.map(expense => 
            expense.id === editingId 
                ? {
                    ...expense,
                    amount,
                    currency,
                    category,
                    description,
                    date: new Date().toISOString()
                  }
                : expense
        );
        editingId = null;
        document.querySelector('.submit-btn').textContent = 'Add Expense';
    } else {
        const newExpense = {
            id: Date.now().toString(),
            amount,
            currency,
            category,
            description,
            date: new Date().toISOString()
        };
        expenses.push(newExpense);
    }

    saveExpenses();
    updateSummary();
    renderExpenses();
    e.target.reset();
});

// Edit expense
function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;

    editingId = id;
    document.getElementById('amount').value = expense.amount;
    document.getElementById('currency').value = expense.currency;
    document.getElementById('category').value = expense.category;
    document.getElementById('description').value = expense.description;
    document.querySelector('.submit-btn').textContent = 'Update Expense';
}

// Delete expense
function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    expenses = expenses.filter(expense => expense.id !== id);
    saveExpenses();
    updateSummary();
    renderExpenses();
}

// Update display when base currency changes
document.getElementById('baseCurrency').addEventListener('change', () => {
    updateSummary();
    renderExpenses();
});

// Initial render
updateSummary();
renderExpenses();