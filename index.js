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

const historyName = document.getElementById('history-name')
const historyAmount = document.getElementById('history-amount')
const historyPercentage = document.getElementById('history-percentage')
const historyCategory = document.getElementById('history-category')

expenseBtn.addEventListener('click',(e)=>{
  e.preventDefault()
    const totalIncomeValue = parseFloat(total);
  
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
  const expenseData = {
    id: `expense-${Date.now()}`,
    amount: parseFloat(expenseAmount.value),
    name: expenseName.value,
    categories: expenseCategories.value,
    actualPer : actualPercentage,
    percentage: expensePer.value,
  };

  const history = JSON.parse(localStorage.getItem('expense')) || [];
  history.push(expenseData);
  
  localStorage.setItem('expense', JSON.stringify(history));
  localStorage.setItem('income', JSON.stringify(updatedIncome));

  totalIncome.textContent = `Your income total is: ${updatedIncome}`;
  updateExpenseSection()
  expenseAmount.value = '';
  expenseName.value = '';
  expenseCategories.value = '';
  expensePer.value = '';
 

  

  

  

})

function updateExpenseSection (){
  const history = JSON.parse(localStorage.getItem('expense')) || [];
  const tableBody = document.querySelector('#expenses .spending-table tbody');
  tableBody.innerHTML = '';
  history.forEach((entry, index) => {
    const historyDiv = document.createElement('tr');

    historyDiv.innerHTML = `
    <td class="history-name">${entry.name}</td>
    <td class="history-amount">${entry.amount}</td>
    <td class="history-category">${entry.categories}</td>
    <td class="history-percentage">${entry.percentage}%</td> 
    <td class="history-category">${entry.actualPer}%</td>  
    <td class="text-underline delete" data-id="${entry.id}">Delete</td>
    <td class="text-underline edit" data-id="${entry.id}">Edit</td>
    `;
  
    tableBody.appendChild(historyDiv);
    document.querySelectorAll('.delete').forEach(cancelBtn => {
      cancelBtn.addEventListener('click', clearExpenseHistoryById);
  });
  document.querySelectorAll('.edit').forEach(cancelBtn => {
    cancelBtn.addEventListener('click', editHistoryById);
});
});
}

// Delete expense by ID
function clearExpenseHistoryById(event) {

  const entryId = event.target.getAttribute('data-id'); 
  let history = JSON.parse(localStorage.getItem('expense')) || [];
  history = history.filter((entry) => entry.id !== entryId);

 
  localStorage.setItem('expense', JSON.stringify(history));

  
  updateExpenseSection();
}

document.addEventListener('DOMContentLoaded', () => {
  updateExpenseSection() 
  
});

//Edit expense by ID

function editHistoryById(event) {
  const entryId = event.target.getAttribute('data-id'); 
  let history = JSON.parse(localStorage.getItem('expenses')) || [];
  
  // history = history.filter(entry => entry.id != entryId);

 
  // localStorage.setItem('expense', JSON.stringify(history));
  let obj = history.find(entry => entry.id ===entryId )
  document.getElementById('expense-name').value = obj.name
  document.getElementById('expense-amount').value = obj.amount
  document.getElementById('expense-percentage').value = obj.percentage
  document.getElementById('categories').value = obj.categories
  
  updateHistorySection();
}



//Home spending history 
// function getSpendingHistory (){
//   const history = JSON.parse(localStorage.getItem('expense')) || [];
//   const tableBody = document.querySelector('#home .spending-table tbody');
//   console.log(tableBody)
//   tableBody.innerHTML = '';
//   history.forEach((entry, index) => {
//     const historyDiv = document.createElement('tr');

//     historyDiv.innerHTML = `
//     <td>Rice</td>
//           <td>Groceries</td>
//           <td><div class="containerStyles">
//             <div class="fillerStyles">
//               <span class="labelStyles"></span>
//             </div>
//           </div></td>
//     `;
  
//     tableBody.appendChild(historyDiv);
//     document.querySelectorAll('.delete').forEach(cancelBtn => {
//       cancelBtn.addEventListener('click', clearExpenseHistoryById);
//   });
//   document.querySelectorAll('.edit').forEach(cancelBtn => {
//     cancelBtn.addEventListener('click', editHistoryById);
// });
// });
// }


