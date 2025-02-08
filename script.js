// Store expenses in localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let editingId = null;

// Fetch exchange rates from Frankfurter API
const exchangeRates = {};

async function fetchExchangeRates() {
    try {
        const response = await fetch('https://api.frankfurter.app/latest');
        const data = await response.json();
        Object.assign(exchangeRates, data.rates, { [data.base]: 1 });
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
}

fetchExchangeRates();

// Convert amount between currencies
function convertAmount(amount, from, to) {
    if (from === to) return amount;
    if (!exchangeRates[from] || !exchangeRates[to]) return amount;
    const toEUR = amount / exchangeRates[from];
    return toEUR * exchangeRates[to];
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
                <button onclick="editExpense('${expense.id}')" class="action-btn edit-btn">✏️</button>
                <button onclick="deleteExpense('${expense.id}')" class="action-btn delete-btn">🗑️</button>
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
                ? { ...expense, amount, currency, category, description, date: new Date().toISOString() }
                : expense
        );
        editingId = null;
        document.querySelector('.submit-btn').textContent = 'Add Expense';
    } else {
        expenses.push({
            id: Date.now().toString(),
            amount,
            currency,
            category,
            description,
            date: new Date().toISOString()
        });
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
