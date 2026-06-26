// Redirect if not logged in
if (!localStorage.getItem("user")) {
  window.location.href = "login.html";
}


let expenses = [];
const form = document.getElementById('expenseForm');
const list = document.getElementById('expenseList');
const totalEl = document.getElementById('total');
const downloadCSVBtn = document.getElementById('downloadCSV');
const downloadChartBtn = document.getElementById('downloadChart');
const downloadBarChartBtn = document.getElementById('downloadBarChart')
const ctx = document.getElementById('expenseChart').getContext('2d');

let chart = new Chart(ctx, {
  type: 'pie',
  data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] }
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

  updateChart();
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  renderExpenses();
}

function updateChart() {
  const categories = {};
  expenses.forEach(exp => {
    categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
  });

  chart.data.labels = Object.keys(categories);
  chart.data.datasets[0].data = Object.values(categories);
  chart.data.datasets[0].backgroundColor = Object.keys(categories).map(() =>
    `hsl(${Math.random()*360},70%,70%)`
  );
  chart.update();
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
  link.href = chart.toBase64Image();
  link.download = "expense_chart.png";
  link.click();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}

