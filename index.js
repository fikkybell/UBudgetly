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
total += amount;
localStorage.setItem('income', JSON.stringify(total));
totalIncome.textContent = `Your income total is: ${total}`;
incomeTotal.textContent = `Your income total is: ${total}`;
  incomeAmount.value = '';
  incomeSource.value = '';
});



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

  let totalIncomeValue = parseFloat(localStorage.getItem('income')) || 0;

  
  const expenseAmountValue = parseFloat(expenseAmount.value);
  if (isNaN(expenseAmountValue) || expenseAmountValue <= 0) {
    alert("Please enter a valid expense amount.");
    return;
  }

 
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
  };


  const history = JSON.parse(localStorage.getItem('expense')) || [];
  history.push(expenseDataItem);
  localStorage.setItem('expense', JSON.stringify(history));

  
  localStorage.setItem('income', JSON.stringify(updatedIncome));


  incomeTotal.textContent = `Your income total is: ${updatedIncome}`;
  totalIncome.textContent = `Your income total is: ${updatedIncome}`;


  updateExpenseSection();
  renderCharts();
  getSpendingHistory() 
  expenseAmount.value = '';
  expenseName.value = '';
  expenseCategories.value = '';
  expensePer.value = '';
});


function updateExpenseSection() {
 
  const history = JSON.parse(localStorage.getItem('expense')) || [];

  let currentIncome = parseFloat(localStorage.getItem('income')) || 0;

  const tableBody = document.querySelector('#expenses .spending-table tbody');
  tableBody.innerHTML = '';

  history.forEach((entry) => {
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
      handleDelete(entry.id);
    });
  });

  totalIncome.textContent = `Your income total is: ${currentIncome}`;
  incomeTotal.textContent = `Your income total is: ${currentIncome}`;
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
  updateExpenseSection() 
  getSpendingHistory() 
  renderCharts();
});



//Home spending history 
function getSpendingHistory() {
  const history = JSON.parse(localStorage.getItem('expense')) || [];
  const tableBody = document.querySelector('#home .spending-table tbody');

  tableBody.innerHTML = ''; 
  console.log(history);

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

function renderCharts() {
  
  const history = JSON.parse(localStorage.getItem('expense')) || [];
  const income = parseFloat(localStorage.getItem('income')) || 0;
  

  const expenseData = history.map((entry) => entry.amount);
  const expenseLabels = history.map((entry) => entry.name);
  const totalExpenses = expenseData.reduce((sum, val) => sum + val, 0);
  

  const expenseChartContainer = document.querySelector('.expense-chart');
  const budgetChartContainer = document.querySelector('.budget.chart');

 
  expenseChartContainer.innerHTML = '';
  
  if (expenseData.length === 0 || totalExpenses === 0) {
   
    expenseChartContainer.innerHTML = '<p class="no-data-class">No Expense Data</p>';
  } else {
    //  a new canvas for the expense chart
    const expenseCanvas = document.createElement('canvas');
    expenseCanvas.id = 'expenseChart';
    expenseChartContainer.appendChild(expenseCanvas);

    //the Expense Chart
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
    // canvas for the budget chart
    const budgetCanvas = document.createElement('canvas');
    budgetCanvas.id = 'budgetChart';
    budgetChartContainer.appendChild(budgetCanvas);

    // Budget Chart
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
//show month
const month = document.querySelector('.arrow')
const now = moment();
now.locale('en');

const months = [];
for (let i = 0; i < 12; i++) {
  months.push(moment().month(i).format("MMMM"));
 
}
console.log(months)
months.map((item)=>{
  console.log(item)
  month.innerHTML = 
`<select>
<option>${item}</option>
</select>`
})

console.log(month)
function showMonth(){
  

}



