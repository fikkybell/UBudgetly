const links = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');


links.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); 

  
    links.forEach(link => link.classList.remove('active'));
    this.classList.add('active');


    const targetId = this.getAttribute('href').slice(1);
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  });
});

// Income 
const income = parseFloat(localStorage.getItem('income')) || 0;
const incomeSource = document.getElementById('source');
const incomeAmount = document.getElementById('amount');
const incomeButton = document.getElementById('income-button');
const incomeTotal = document.querySelector('.income-total');


let total = JSON.parse(localStorage.getItem('income')) || 0;
incomeTotal.textContent = `Your income total is: ${total}`;
incomeButton.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = parseFloat(incomeAmount.value);

  if (!amount || isNaN(amount) || amount < 0) {
    alert('Please enter a valid income source and amount.');
    return;
  }
  const currentMonth = document.querySelector('#month-dropdown')?.value || moment().format('MMMM');

  let incomeHistory = JSON.parse(localStorage.getItem('incomeHistory')) || {};


  incomeHistory[currentMonth] = (incomeHistory[currentMonth] || 0) + amount;

  localStorage.setItem('incomeHistory', JSON.stringify(incomeHistory));


  updateDisplayedIncome(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);

  incomeAmount.value = '';
  incomeSource.value = '';
});


function updateDisplayedIncome(selectedMonth) {
  let incomeHistory = JSON.parse(localStorage.getItem('incomeHistory')) || {};
  console.log(incomeHistory)
  let totalIncomeValue = incomeHistory[selectedMonth] || 0;

  incomeTotal.textContent = `Your income total is: ${totalIncomeValue}`;
  totalIncome.textContent = `Your income total is: ${totalIncomeValue}`;
}




//Expenses section 
const expenseName = document.getElementById('expense-name')
const expenseAmount = document.getElementById('expense-amount')
const expensePer = document.getElementById('expense-percentage')
const expenseCategories = document.getElementById('categories')
const totalIncome = document.querySelector('.add-more')
const expenseBtn = document.getElementById('expense-btn')
totalIncome.textContent = `Your income total is: ${total}`



expenseBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const selectedMonthElement = document.querySelector('#month-dropdown');
  const currentMonth = selectedMonthElement ? selectedMonthElement.value : moment().format('MMMM');


  let incomeHistory = JSON.parse(localStorage.getItem('incomeHistory')) || {};
  let totalIncomeValue = incomeHistory[selectedMonth] || 0;

  const expenseAmountValue = parseFloat(expenseAmount.value);

  if (isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
    alert("Please enter a valid expense amount.");
    return;
  }
console.log('income',totalIncomeValue)
console.log('exp', expenseAmountValue)
  const updatedIncome = totalIncomeValue - expenseAmountValue;
  if (updatedIncome < 0) {
    alert("The expense exceeds your total income. Operation not allowed.");
    return;  
  }

  const actualPercentage = (expenseAmountValue / totalIncomeValue) * 100;
  

  const expenseDataItem = {
    id: `expense-${Date.now()}`,
    amount: expenseAmountValue,
    name: expenseName.value,
    categories: expenseCategories.value,
    actualPer: actualPercentage.toFixed(1),
    percentage: expensePer.value,
    month: currentMonth,
  };

  let history = JSON.parse(localStorage.getItem('expenseHistory')) || {};
  if (!history[currentMonth]) {
    history[currentMonth] = [];
  }

  history[currentMonth].push(expenseDataItem);
  localStorage.setItem('expenseHistory', JSON.stringify(history));
  localStorage.setItem('incomeHistory', JSON.stringify(updatedIncome));


  updateDisplayedIncome(currentMonth);
  updateExpenseSection(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);

  expenseAmount.value = '';
  expenseName.value = '';
  expenseCategories.value = '';
  expensePer.value = '';
});




function updateExpenseSection(selectedMonth) {
  const history = JSON.parse(localStorage.getItem('expenseHistory')) || {};
  console.log('history',history)
  const monthExpenses = history[selectedMonth] || [];

  const tableBody = document.querySelector('#expenses .spending-table tbody');
  tableBody.innerHTML = '';

  monthExpenses.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="history-name">${entry.name}</td>
      <td class="history-amount">${entry.amount}</td>
      <td class="history-category">${entry.categories}</td>
      <td class="history-percentage">${entry.percentage}%</td> 
      <td class="history-category">${entry.actualPer}%</td>  
      <td class="text-underline delete" data-id="${entry.id}">Delete</td>
    `;
    tableBody.appendChild(row);

    const deleteCell = row.querySelector('.delete');
    deleteCell.addEventListener('click', () => {
      handleDelete(entry.id, selectedMonth);
    });
  });
}


//Handle Delete
function handleDelete(entryId) {
  let history = JSON.parse(localStorage.getItem('expense')) || [];

  const entryToDelete = history.find((item) => item.id === entryId);
  if (!entryToDelete) return; 

  let currentIncome = parseFloat(localStorage.getItem('income')) || 0;
  currentIncome += parseFloat(entryToDelete.amount);
  localStorage.setItem('income', JSON.stringify(currentIncome));

  history = history.filter((item) => item.id !== entryId);
  localStorage.setItem('expense', JSON.stringify(history));

 
  updateExpenseSection();
  renderCharts(); 
  getSpendingHistory() 
}

document.addEventListener('DOMContentLoaded', () => {
  const currentMonth = moment().format('MMMM'); 
  showMonth();  
  updateDisplayedIncome(currentMonth); 
  updateExpenseSection(currentMonth);
  renderCharts(currentMonth);
  getSpendingHistory(currentMonth);
});





//Home spending history 
function getSpendingHistory() {
  const history = JSON.parse(localStorage.getItem('expense')) || [];
  const tableBody = document.querySelector('#home .spending-table tbody');
  
  tableBody.innerHTML = ''; 


  history.forEach((entry) => {
    const actualPer = entry.actualPer
    const userDefinedPer = parseFloat(entry.percentage); 

    let backgroundColor;
    if (actualPer  > userDefinedPer) {
      backgroundColor = 'red'; 
    } else if (actualPer >= userDefinedPer * 0.8 ) {
      backgroundColor = 'yellow'; 
    } else {
      backgroundColor = 'green'; 
    }

    const historyDiv = document.createElement('tr');
    historyDiv.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.categories}</td>
      <td>
        <div class="containerStyles">
          <div 
            class="fillerStyles" 
            style="width: ${Math.min(actualPer, 100)}%; background-color: ${backgroundColor};">
            <span class="labelStyles"></span>
          </div>
        </div>
      </td>
    `;

    tableBody.appendChild(historyDiv);

  });
}

function renderCharts(selectedMonth) {
  const history = JSON.parse(localStorage.getItem('expenseHistory')) || {};
  const incomeHistory = JSON.parse(localStorage.getItem('incomeHistory')) || {};
  const income = incomeHistory[selectedMonth] || 0;
  const monthExpenses = history[selectedMonth] || [];

  const expenseData = monthExpenses.map((entry) => entry.amount);
  const expenseLabels = monthExpenses.map((entry) => entry.name);
  const totalExpenses = expenseData.reduce((sum, val) => sum + val, 0);

  const expenseChartContainer = document.querySelector('.expense-chart');
  const budgetChartContainer = document.querySelector('.budget.chart');

  expenseChartContainer.innerHTML = '';
  if (expenseData.length === 0 || totalExpenses === 0) {
    expenseChartContainer.innerHTML = '<p class="no-data-class">No Expense Data</p>';
  } else {
    const expenseCanvas = document.createElement('canvas');
    expenseCanvas.id = 'expenseChart';
    expenseChartContainer.appendChild(expenseCanvas);

    const expenseCtx = expenseCanvas.getContext('2d');
    new Chart(expenseCtx, {
      type: 'doughnut',
      data: {
        labels: expenseLabels,
        datasets: [{
          label: 'Expenses',
          data: expenseData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  budgetChartContainer.innerHTML = '';
  if (income === 0 && totalExpenses === 0) {
    budgetChartContainer.innerHTML = '<p class="no-data-class">No data for Income and Expenses</p>';
  } else {
    const budgetCanvas = document.createElement('canvas');
    budgetCanvas.id = 'budgetChart';
    budgetChartContainer.appendChild(budgetCanvas);

    const budgetCtx = budgetCanvas.getContext('2d');
    new Chart(budgetCtx, {
      type: 'doughnut',
      data: {
        labels: ['Total Income', 'Total Expenses'],
        datasets: [{
          label: 'Budget Distribution',
          data: [income, totalExpenses],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }
}





 function showMonth() {
  const monthSelector = document.querySelector(".arrow");

 
  if (!document.querySelector("#month-dropdown")) {
    const select = document.createElement("select");
    select.id = "month-dropdown";
    select.classList.add("button");

    const months = [];
    for (let i = 0; i < 12; i++) {
      months.push(moment().month(i).format("MMMM"));
    }

    months.forEach((item) => {
      const option = document.createElement("option");
      option.textContent = item;
      option.value = item;
      select.appendChild(option);
    });

    monthSelector.appendChild(select);

 
    select.addEventListener("change", () => {
      const selectedMonth = select.value;
      updateDisplayedIncome(selectedMonth);
      updateExpenseSection(selectedMonth);
      renderCharts(selectedMonth);
      getSpendingHistory(selectedMonth);
    });
  }
}




