// script.js - MoneyMagnet Finance Tracker

// Inisialisasi Feather Icons
feather.replace();

// Ambil elemen DOM
const submitBtn = document.getElementById("submitBtn");
const table = document.getElementById("transactionTable");
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const netProfitEl = document.getElementById("netProfit");

// Array transaksi
let transactions = [];

/* =========================
   LOCAL STORAGE FUNCTIONS
========================= */

// simpan data ke localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// ambil data dari localStorage saat halaman dibuka
function loadData() {
  const savedData = localStorage.getItem("transactions");
  if (savedData) {
    transactions = JSON.parse(savedData);
  }
}

/* =========================
   INIT DATA
========================= */
loadData();

/* =========================
   CHART
========================= */
const ctx = document.getElementById("financeChart").getContext("2d");

const financeChart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#16a34a", "#dc2626"]
      }
    ]
  }
});

/* =========================
   ADD TRANSACTION
========================= */
submitBtn.addEventListener("click", function () {
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value.trim();
  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const notes = document.getElementById("notes").value.trim();

  // Validasi (FIXED)
  if (!category || !description  isNaN(amount) || amount <= 0) {
  alert("Harap isi semua field dengan benar!");
  return;
}

  // Tambah transaksi
  transactions.push({
    type,
    category,
    description,
    amount,
    notes
  });

  // simpan + render
  saveData();
  renderData();

  // reset input
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("notes").value = "";
});

/* =========================
   RENDER DATA
========================= */
function renderData() {
  table.innerHTML = "";

  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t, index) => {
    if (t.type === "Income") {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
    }

    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="p-2">${t.type}</td>
      <td class="p-2">${t.category}</td>
      <td class="p-2">${t.description}</td>
      <td class="p-2 ${t.type === "Income" ? "text-green-600" : "text-red-600"} font-bold">
        Rp ${t.amount.toLocaleString()}
      </td>
      <td class="p-2">${t.notes}</td>
      <td class="p-2 text-center">
        <button onclick="deleteTransaction(${index})"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center gap-1 mx-auto">
          <i data-feather="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;

    table.appendChild(row);
  });

  // update summary
  totalIncomeEl.textContent = "Rp " + totalIncome.toLocaleString();
  totalExpenseEl.textContent = "Rp " + totalExpense.toLocaleString();
  netProfitEl.textContent = "Rp " + (totalIncome - totalExpense).toLocaleString();

  // update chart
  financeChart.data.datasets[0].data = [totalIncome, totalExpense];
  financeChart.update();

  // re-render icons
  feather.replace();
}

/* =========================
   DELETE TRANSACTION
========================= */
function deleteTransaction(index) {
  if (confirm("Yakin ingin hapus transaksi ini?")) {
    transactions.splice(index, 1);
    saveData();
    renderData();
  }
}

/* =========================
   FIRST LOAD RENDER
========================= */
renderData();
