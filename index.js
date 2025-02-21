const links = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    links.forEach((link) => link.classList.remove("active"));
    this.classList.add("active");

    const targetId = this.getAttribute("href").slice(1);
    sections.forEach((section) => {
      if (section.id === targetId) {
        section.classList.remove("hidden");
      } else {
        section.classList.add("hidden");
      }
    });
  });
});
// Modal
const openModalButtons = document.getElementById("modalbtn");
const closeModalButtons = document.getElementById("close-btn");
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
openModalButtons.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = parseFloat(incomeAmount.value);
  if (!amount || isNaN(amount) || amount < 0) {
    alert("Please enter a valid income source and amount.");
    return;
  }
  if (modal === null) return;
  else {
    modal.classList.add("active");
    overlay.classList.add("active");
  }
});

closeModalButtons.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.remove("active");
  overlay.classList.remove("active");
});

// Income

const incomeSource = document.getElementById("source");
const incomeAmount = document.getElementById("amount");
const incomeButton = document.getElementById("income-button");
const incomeTotal = document.querySelector(".income-total");
const monthIncome = document.querySelector(".month-income");

const selectedMonthElement = document.querySelector("#month-dropdown");
const currentMonth = selectedMonthElement
  ? selectedMonthElement.value
  : moment().format("MMMM");
let expenseHistory = JSON.parse(localStorage.getItem("expenseHistory")) || {};

const monthSelector = document.querySelector(".arrow");

let incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};
let incomeHistoryFixed =
  JSON.parse(localStorage.getItem("incomeHistoryFixed")) || {};
let total = incomeHistory[currentMonth] || 0;

//income
incomeButton.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = parseFloat(incomeAmount.value);
  if (!amount || isNaN(amount) || amount < 0) {
    alert("Please enter a valid income source and amount.");
    return;
  }
  const currentMonth =
    document.querySelector("#month-dropdown")?.value || moment().format("MMMM");

 
  let incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};
  let incomeHistoryFixed =
    JSON.parse(localStorage.getItem("incomeHistoryFixed")) || {};

 
  if (!incomeHistory[currentMonth]) {
    incomeHistory[currentMonth] = 0;
  }
  if (!incomeHistoryFixed[currentMonth]) {
    incomeHistoryFixed[currentMonth] = [];
  }

  incomeHistoryFixed[currentMonth].push({
    id: `income-${Date.now()}`,
    amount: amount,
    name: incomeSource.value,
  });
  incomeHistory[currentMonth] = +amount;
 
  localStorage.setItem("incomeHistory", JSON.stringify(incomeHistory));
  localStorage.setItem(
    "incomeHistoryFixed",
    JSON.stringify(incomeHistoryFixed)
  );
  modal.classList.remove("active");
  overlay.classList.remove("active");
  openModalButtons.style.display = "none";
  incomeAmount.disabled = true;
  incomeSource.disabled = true;

  updateDisplayedIncome(currentMonth);
  updateDisplayedIncomeText(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);
  updateDisplayedIncomeText(currentMonth);

  setButtonState(true);
});

// if (getButtonState()) {
//   console.log("The button was clicked before and is hidden.");
// } else {
//   console.log("The button is still visible.");
// }

function updateDisplayedIncome(selectedMonth) {
  const currentMonth = moment().format("MMMM");
  let incomeHistoryFixed =
    JSON.parse(localStorage.getItem("incomeHistoryFixed")) || {};
  let incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};

  if (selectedMonth !== currentMonth) {
    incomeTotal.textContent = `Viewing ${selectedMonth} income (read-only)`;
    totalIncome.textContent = "";
    monthIncome.textContent = `Viewing ${selectedMonth} income`;
    monthexp.textContent = `Add ${selectedMonth} expenses`;
    return;
  }

  const selectedMonthElement = document.querySelector("#month-dropdown");
  let totalIncomeValue = incomeHistory[selectedMonth] || 0;

  // to prevent undefined error
  let fixIncomeValue =
    incomeHistoryFixed[selectedMonth] &&
    incomeHistoryFixed[selectedMonth].length > 0
      ? incomeHistoryFixed[selectedMonth][0].amount
      : 0;

  let monthShort = selectedMonthElement
    ? selectedMonthElement.value.slice(0, 3)
    : "";

  incomeTotal.textContent = `Your ${monthShort} income is: ${fixIncomeValue}`;
  totalIncome.textContent = `Your remaining income is: ${totalIncomeValue}`;
  monthIncome.textContent = `Add ${selectedMonth} income`;
  // monthexp.textContent = `Add ${monthShort} expenses`;
}

function updateDisplayedIncomeText(selectedMonth) {
  let incomeHistoryFixed =
    JSON.parse(localStorage.getItem("incomeHistoryFixed")) || {};

  let fixIncomeValue =
    incomeHistoryFixed[selectedMonth] &&
    incomeHistoryFixed[selectedMonth].length > 0
      ? incomeHistoryFixed[selectedMonth][0].amount
      : "";

  let fixIncomeSource =
    incomeHistoryFixed[selectedMonth] &&
    incomeHistoryFixed[selectedMonth].length > 0
      ? incomeHistoryFixed[selectedMonth][0].name
      : "";

  incomeSource.value = fixIncomeSource;
  incomeAmount.value = fixIncomeValue;
  
}

//Expenses section
const expenseName = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expensePer = document.getElementById("expense-percentage");
const expenseCategories = document.getElementById("categories");
const totalIncome = document.querySelector(".add-more");
const expenseBtn = document.getElementById("expense-btn");
const monthexp = document.querySelector(".monthExp");
const modalExp = document.getElementById("modal-expense");
const modalInvalid = document.getElementById("modal-invalid");
const modalper = document.getElementById("modal-per");
const closeexpModal = document.getElementById("close-btn-exp");
const closeexpInvalid = document.getElementById("close-btn-invalid");
const closeexper = document.getElementById("close-btn-per");
closeexpModal.addEventListener("click", (e) => {
  e.preventDefault();
  modalExp.classList.remove("active");
  modalInvalid.classList.remove("active");
});

closeexpInvalid.addEventListener("click", (e) => {
  e.preventDefault();
  modalInvalid.classList.remove("active");
});
closeexper.addEventListener("click", (e) => {
  e.preventDefault();
  modalper.classList.remove("active");
});

expenseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const selectedMonthElement = document.querySelector("#month-dropdown");
  const currentMonth = selectedMonthElement
    ? selectedMonthElement.value
    : moment().format("MMMM");

  let incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};
  let incomeHistoryFixed =
    JSON.parse(localStorage.getItem("incomeHistoryFixed")) || {};

  let totalIncomeValue = incomeHistory[selectedMonthElement.value] || 0;
  let fixIncomeValue =
    incomeHistoryFixed[selectedMonthElement.value][0].amount || 0;

  const expenseAmountValue = parseFloat(expenseAmount.value);
  const expPervalue = parseFloat(expensePer.value);
  if (
    isNaN(expenseAmountValue) ||
    expenseAmountValue <= 0 ||
    expPervalue <= 0 ||
    isNaN(expPervalue) ||
    expenseName.value == ""
  ) {
    modalInvalid.classList.add("active");
    return;
  }

  if (expenseAmountValue > totalIncomeValue) {
    modalExp.classList.add("active");
    return;
  }
  const expenseHistoryData =
    JSON.parse(localStorage.getItem("expenseHistory")) || {};
  const updatedIncome = totalIncomeValue - expenseAmountValue;
  const actualPercentage = (expenseAmountValue / fixIncomeValue) * 100;
  const monthExpenses = Object.values(expenseHistoryData[currentMonth] || {});

  const currentTotal = monthExpenses.reduce(
    (acc, item) => acc + parseFloat(item.actualPer),
    0
  );
  // console.log(currentTotal);


  if (currentTotal + parseFloat(actualPercentage.toFixed(0)) > 100) {
    modalper.classList.add("active");
    // console.log(currentTotal + parseFloat(actualPercentage.toFixed(0)));
    return;
  }

  const expenseDataItem = {
    id: `expense-${Date.now()}`,
    amount: expenseAmountValue,
    name: expenseName.value,
    categories: expenseCategories.value,
    actualPer: actualPercentage.toFixed(0),
    percentage: expensePer.value,
    month: currentMonth,
  };

  let expenseHistory = JSON.parse(localStorage.getItem("expenseHistory")) || {};

  if (!expenseHistory[currentMonth]) {
    expenseHistory[currentMonth] = [];
  }
  expenseHistory[currentMonth].push(expenseDataItem);
  localStorage.setItem("expenseHistory", JSON.stringify(expenseHistory));

  incomeHistory[currentMonth] = updatedIncome;
  localStorage.setItem("incomeHistory", JSON.stringify(incomeHistory));

  updateDisplayedIncome(currentMonth);
  updateExpenseSection(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);

  expenseAmount.value = "";
  expenseName.value = "";
  expenseCategories.value = "";
  expensePer.value = "";
});

function totalper() {
  const expenseHistoryData =
    JSON.parse(localStorage.getItem("expenseHistory")) || {};
  const monthExpenses = expenseHistoryData[selectedMonthElement.value] || [];
}

// update expense table and display expense table

function updateExpenseSection(selectedMonth) {
  const expenseHistoryData =
    JSON.parse(localStorage.getItem("expenseHistory")) || {};
  const monthExpenses = expenseHistoryData[selectedMonth] || [];

  const tableBody = document.querySelector("#expenses .spending-table tbody");
  tableBody.innerHTML = "";

  const currentMonth = moment().format("MMMM");
  const isEditable = selectedMonth === currentMonth;

  monthExpenses.forEach((entry) => {
    const deleteCellContent = isEditable
      ? `<td class="text-underline delete" data-id="${entry.id}">Delete</td>`
      : `<td></td>`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="history-name">${entry.name}</td>
      <td class="history-amount">${entry.amount}</td>
      <td class="history-category">${entry.categories}</td>
      <td class="history-percentage">${entry.percentage}%</td>
      <td class="history-category">${entry.actualPer}%</td>
      ${deleteCellContent}
    `;
    tableBody.appendChild(row);

    if (isEditable) {
      const deleteCell = row.querySelector(".delete");
      if (deleteCell) {
        deleteCell.addEventListener("click", () => {
          handleDelete(entry.id, selectedMonth);
        });
      }
    }
  });
}

//Handle Delete
function handleDelete(entryId, selectedMonth) {
  let expenseHistory = JSON.parse(localStorage.getItem("expenseHistory")) || {};

  let monthExpenses = expenseHistory[selectedMonth] || [];

  const entryToDelete = monthExpenses.find((item) => item.id === entryId);
  if (!entryToDelete) return;

  let incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};
  let currentIncome = incomeHistory[selectedMonth] || 0;

  currentIncome += parseFloat(entryToDelete.amount);
  incomeHistory[selectedMonth] = currentIncome;
  localStorage.setItem("incomeHistory", JSON.stringify(incomeHistory));

  monthExpenses = monthExpenses.filter((item) => item.id !== entryId);
  expenseHistory[selectedMonth] = monthExpenses;
  localStorage.setItem("expenseHistory", JSON.stringify(expenseHistory));

  updateExpenseSection(selectedMonth);
  renderCharts(selectedMonth);
  getSpendingHistory(selectedMonth);
  updateDisplayedIncome(selectedMonth);
}

document.addEventListener("DOMContentLoaded", () => {
  const currentMonth = moment().format("MMMM");

  showMonth(currentMonth);
  updateDisplayedIncome(currentMonth);
  updateDisplayedIncomeText(currentMonth);
  updateExpenseSection(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);
});

//Home spending history
function getSpendingHistory() {
  const history = JSON.parse(localStorage.getItem("expenseHistory")) || [];
  const selectedMonthElement = document.querySelector("#month-dropdown");
  const currentMonth = selectedMonthElement
    ? selectedMonthElement.value
    : moment().format("MMMM");
  const tableBody = document.querySelector("#home .spending-table tbody");
  const monthExpenses = history[currentMonth] || [];
  tableBody.innerHTML = "";

  monthExpenses.forEach((entry) => {
    const actualPer = entry.actualPer;
    const userDefinedPer = parseFloat(entry.percentage);

    let backgroundColor;
  if (actualPer <= userDefinedPer) {
    backgroundColor = "green";
  } else if (actualPer <= userDefinedPer * 1.2) { // up to 20% over target

    backgroundColor = "yellow";
  } else {
    backgroundColor = "red";
  }
  // console.log(entry.name, backgroundColor);
    const historyDiv = document.createElement("tr");
    historyDiv.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.categories}</td>
      <td>
        <div class="containerStyles">
          <div 
            class="fillerStyles" 
            style="width: ${Math.min(
              actualPer,
              100
            )}%; background-color: ${backgroundColor};">
            <span class="labelStyles"></span>
          </div>
        </div>
      </td>
    `;

    tableBody.appendChild(historyDiv);
  });
}

// show chart
function renderCharts(selectedMonth) {
  const history = JSON.parse(localStorage.getItem("expenseHistory")) || {};
  const incomeHistory = JSON.parse(localStorage.getItem("incomeHistory")) || {};
  const income = incomeHistory[selectedMonth] || 0;
  const monthExpenses = history[selectedMonth] || [];

  const expenseData = monthExpenses.map((entry) => entry.amount);
  const expenseLabels = monthExpenses.map((entry) => entry.name);
  const totalExpenses = expenseData.reduce((sum, val) => sum + val, 0);

  const expenseChartContainer = document.querySelector(".expense-chart");
  const budgetChartContainer = document.querySelector(".budget.chart");

  expenseChartContainer.innerHTML = "";
  if (expenseData.length === 0 || totalExpenses === 0) {
    expenseChartContainer.innerHTML =
      '<p class="no-data-class">No Expense Data</p>';
  } else {
    const expenseCanvas = document.createElement("canvas");
    expenseCanvas.id = "expenseChart";
    expenseChartContainer.appendChild(expenseCanvas);

    const expenseCtx = expenseCanvas.getContext("2d");
    new Chart(expenseCtx, {
      type: "doughnut",
      data: {
        labels: expenseLabels,
        datasets: [
          {
            label: "Expenses",
            data: expenseData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
  }

  budgetChartContainer.innerHTML = "";
  if (income === 0 && totalExpenses === 0) {
    budgetChartContainer.innerHTML =
      '<p class="no-data-class">No Income Data</p>';
  } else {
    const budgetCanvas = document.createElement("canvas");
    budgetCanvas.id = "budgetChart";
    budgetChartContainer.appendChild(budgetCanvas);

    const budgetCtx = budgetCanvas.getContext("2d");
    new Chart(budgetCtx, {
      type: "doughnut",
      data: {
        labels: ["Remaining Income", "Total Expenses"],
        datasets: [
          {
            label: "Budget Distribution",
            data: [income, totalExpenses],
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
      },
    });
  }
}

// show all months
function showMonth(defaultMonth) {
  const monthSelector = document.querySelector(".arrow");

  if (!document.querySelector("#month-dropdown")) {
    const select = document.createElement("select");
    select.id = "month-dropdown";
    // select.classList.add("button");

    for (let i = 0; i < 12; i++) {
      const monthName = moment().month(i).format("MMMM");
      const option = document.createElement("option");
      option.textContent = monthName;
      option.value = monthName;
      select.appendChild(option);
    }

    monthSelector.appendChild(select);
    select.value = defaultMonth || moment().format("MMMM");

    select.addEventListener("change", () => {
      const selectedMonth = select.value;
      updateDisplayedIncome(selectedMonth);
      updateDisplayedIncomeText(selectedMonth);
      updateExpenseSection(selectedMonth);
      renderCharts(selectedMonth);
      getSpendingHistory(selectedMonth);
      setEditMode(selectedMonth);
    });
  }
}

function getButtonState() {
  return localStorage.getItem("myButtonClicked") === "true";
}
function setButtonState(state) {
  localStorage.setItem("myButtonClicked", state ? "true" : "false");
}

document.addEventListener("DOMContentLoaded", () => {

  if (getButtonState()) {
    openModalButtons.style.display = "none";
    incomeAmount.disabled = true;
    incomeSource.disabled = true;
  }

});

function setEditMode(selectedMonth) {
  const current = moment().format("MMMM");
  const isCurrent = selectedMonth === current;

  // Income controls
  // incomeSource.disabled = !isCurrent;
  // incomeAmount.disabled = !isCurrent;
  incomeButton.style.display = isCurrent ? "inline-block" : "none";
  openModalButtons.style.display = isCurrent ? "inline-block" : "none";
 
  if (isCurrent && !getButtonState()) {
    openModalButtons.style.display = "inline-block";
  } else {
    openModalButtons.style.display = "none";
    incomeAmount.disabled = true;
    incomeSource.disabled = true;
  }
  // Expense controls
  expenseName.disabled = !isCurrent;
  expenseAmount.disabled = !isCurrent;
  expensePer.disabled = !isCurrent;
  expenseCategories.disabled = !isCurrent;
  expenseBtn.style.display = isCurrent ? "inline-block" : "none";
}
