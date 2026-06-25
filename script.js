let expenses = [];
const form = document.getElementById('expenseForm');
const list = document.getElementById('expenseList');
const totalEl = document.getElementById('total');
const downloadCSVBtn = document.getElementById('downloadCSV');
const downloadChartBtn = document.getElementById('downloadChart');
const downloadBarChartBtn = document.getElementById('downloadBarChart');

const pieCtx = document.getElementById('expenseChart').getContext('2d');
const barCtx = document.getElementById('barChart').getContext('2d');

let pieChart = new Chart(pieCtx, {
  type: 'pie',
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] }
});

let barChart = new Chart(barCtx, {
  type: 'bar',
  data: { labels: [], datasets: [{ label: 'Expenses', data: [], backgroundColor: [] }] },
  options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const amount = parseFloat(document.getElementById('amount').value);
  const category = document.getElementById('category').value;

  const expense = { id: Date.now(), title, amount, category };
  expenses.push(expense);
  renderExpenses();
  form.reset();
});

function renderExpenses() {
  list.innerHTML = '';
  let total = 0;
  expenses.forEach(exp => {
    total += exp.amount;
    const li = document.createElement('li');
    li.innerHTML = `${exp.title} - ₹${exp.amount} (${exp.category})
      <button onclick="deleteExpense(${exp.id})">❌</button>`;
    list.appendChild(li);
  });
  totalEl.textContent = total;

  updateCharts();
}


function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  renderExpenses();
}

function updateCharts() {
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);
  const colors = labels.map(() => `hsl(${Math.random()*360},70%,70%)`);

  // Update Pie Chart
  pieChart.data.labels = labels;
  pieChart.data.datasets[0].data = data;
  pieChart.data.datasets[0].backgroundColor = colors;
  pieChart.update();

  // Update Bar Chart
  barChart.data.labels = labels;
  barChart.data.datasets[0].data = data;
  barChart.data.datasets[0].backgroundColor = colors;
  barChart.update();
}

downloadCSVBtn.addEventListener('click', () => {
  let csv = "Title,Amount,Category\n";
  expenses.forEach(exp => {
    csv += `${exp.title},${exp.amount},${exp.category}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = "expenses.csv";
  link.click();
});

downloadChartBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = pieChart.toBase64Image();
  link.download = "expense_pie_chart.png";
  link.click();
});


downloadBarChartBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = barChart.toBase64Image();
  link.download = "expense_bar_chart.png";
  link.click();
});


