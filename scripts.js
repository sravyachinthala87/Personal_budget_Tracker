let transactions = [];
let totalIncome = 0;
let totalExpenses = 0;
let remainingBalance = 0;

// Handle form submission for adding income/expense
document.getElementById('budgetForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    // Add transaction
    const transaction = { amount, category, type };
    transactions.push(transaction);

    // Update the display
    updateDisplay();
    updateChart();

    // Clear the form
    document.getElementById('budgetForm').reset();
});

// Update the Budget Overview
function updateDisplay() {
    totalIncome = 0;
    totalExpenses = 0;

    // Calculate total income and expenses
    transactions.forEach(transaction => {
        if (transaction.type === 'Income') {
            totalIncome += transaction.amount;
        } else if (transaction.type === 'Expense') {
            totalExpenses += transaction.amount;
        }
    });

    remainingBalance = totalIncome - totalExpenses;

    // Update the UI
    document.getElementById('totalIncome').textContent = `Total Income: $${totalIncome.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `Total Expenses: $${totalExpenses.toFixed(2)}`;
    document.getElementById('remainingBalance').textContent = `Remaining Balance: $${remainingBalance.toFixed(2)}`;
}

// Update the spending breakdown chart
function updateChart() {
    const categoryData = {};

    // Categorize expenses for chart
    transactions.forEach(transaction => {
        if (transaction.type === 'Expense') {
            if (categoryData[transaction.category]) {
                categoryData[transaction.category] += transaction.amount;
            } else {
                categoryData[transaction.category] = transaction.amount;
            }
        }
    });

    // Prepare data for the chart
    const chartData = {
        labels: Object.keys(categoryData),
        datasets: [{
            label: 'Expenses Breakdown',
            data: Object.values(categoryData),
            backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A6'],
            hoverOffset: 4
        }]
    };

    // Create or update the chart
    const ctx = document.getElementById('budgetChart').getContext('2d');
    if (window.budgetChartInstance) {
        window.budgetChartInstance.destroy();
    }
    window.budgetChartInstance = new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
                        }
                    }
                }
            }
        }
    });
}

// Generate monthly report
document.getElementById('generateReport').addEventListener('click', function() {
    const report = `
        <strong>Monthly Summary:</strong><br>
        Total Income: $${totalIncome.toFixed(2)}<br>
        Total Expenses: $${totalExpenses.toFixed(2)}<br>
        Savings: $${remainingBalance.toFixed(2)}
    `;
    document.getElementById('monthlyReport').innerHTML = report;
});
