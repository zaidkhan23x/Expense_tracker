const form = document.getElementById("transactionForm");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
let typeInput;
let categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");

const transactionList = document.getElementById("transactionList");
const filterCategory = document.getElementById("filterCategory");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");
const chart_head = document.querySelector('.chart-head');
const visual_dashboard = document.querySelector('.dashboard-box');
const circle_chart = document.querySelector('.dashboard');
const submitBtn = document.getElementById("submitBtn");

let transactions = JSON.parse(
  localStorage.getItem("transactions")
) || [];

let editId = null;
// curenct date by default
dateInput.value = new Date().toISOString().split("T")[0];

const expense_category = document.querySelector('.expense-category');
const income_category = document.querySelector('.income-category');
const transactionBtn = document.querySelector('.add-transaction-btn');
const cancelBtn = document.querySelector('.cancelBtn');
function setformType(type){
   form.classList.remove('Form');
   transactionBtn.style.display = "none";
    if(type==='expense'){
    income_category.style.display = 'none';
    expense_category.style.display = 'block';
    expense_category.setAttribute('id', 'category');
    income_category.setAttribute("id", "");
    categoryInput = expense_category;
    typeInput = 'expense';
    }else  {
    income_category.style.display = 'block';
    expense_category.style.display = 'none';
     expense_category.setAttribute('id', '');
    income_category.setAttribute("id", "category");
    categoryInput = income_category;
     console.log(categoryInput);
      typeInput = 'income';
    }
}
function cancelform(){
    form.classList.add('Form');
    console.log("Transaction canceled");
    transactionBtn.style.display = "flex";
}

// Add or update transaction
form.addEventListener("submit", function (e) {

  e.preventDefault();

  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput;
  const category = categoryInput.value;
  const date = dateInput.value;

  if (!description || !amount || !date) {
    return;
  }
  if (editId !== null) {

    const transaction = transactions.find(  item => item.id === editId );

    transaction.description = description;
    transaction.amount = amount;
    transaction.type = type;
    transaction.category = category;
    transaction.date = date;

    editId = null;
    submitBtn.textContent = "Add Transaction";
  } else {

    const newTransaction = {
      id: Date.now(),
      description: description,
      amount: amount,
      type: type,
      category: category,
      date: date
    };

    transactions.push(newTransaction);
  }
  saveTransactions();

  form.reset();

  dateInput.value = new Date()
    .toISOString()
    .split("T")[0];

  displayTransactions();
  updateSummary();

    form.classList.add('Form');
    console.log("Transaction added");
    transactionBtn.style.display = "flex";
});
// Save data in local Storage
function saveTransactions() {

  localStorage.setItem("transactions", JSON.stringify(transactions) );
}
// Display transactions
function displayTransactions() {
 let check = true;
  const selectedCategory = filterCategory.value;

  let filteredTransactions = transactions;

  if (selectedCategory !== "all") {

    filteredTransactions = transactions.filter(
      transaction => transaction.category === selectedCategory
    );
  }
  transactionList.innerHTML = "";
  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `
      <div class="empty"> No transactions found. </div>`;
    
    return;
  }
  let exp_amount= filteredTransactions.reduce((sum,item)=>{
    if(item.type == "expense")
     return sum +item.amount;
    else
      return sum;
    },0);
    circle_chart.style.setProperty('--content',`"₹${exp_amount}"`);
  console.log(exp_amount);
  let food_amount =0,shop_amount =0,health_amount=0
  ,trans_amount=0,bill_amount=0,other_amount=0,Edu_amount=0;
  let colorData=[];
  filteredTransactions.slice().reverse().forEach(transaction => {
      
      const div = document.createElement("div");
      div.className = "transaction";

      const sign = transaction.type === "income" ? "+" : "-";

      div.innerHTML = `
        <div class="transaction-info">
          <h3>${transaction.description}</h3>
          <p>
            ${transaction.category} •
            ${formatDate(transaction.date)}
          </p>
        </div>
        <div class="transaction-right">
          <span class="amount ${transaction.type}">
            ${sign} ₹${transaction.amount.toLocaleString("en-IN")}
          </span>
          <div class="actions">
            <button
              class="edit-btn"
              onclick="editTransaction(${transaction.id})"
            >
              Edit
            </button>
            <button
              class="delete-btn"
              onclick="deleteTransaction(${transaction.id})"
            >
              Delete
            </button>
          </div>
        </div>
      `;

      transactionList.appendChild(div);

      if(check === true){
     if(transaction.type == 'expense'){
      chart_head.textContent = "Where it's going";
      visual_dashboard.style.display = 'block' ;
      check = false;
     }else{
      chart_head.textContent = "Add an expense to see your breakdown by category.";
      visual_dashboard.style.display = 'none';
     } }

     //making expense chart
    if(transaction.type == 'expense'){
      const category = transaction.category;
      console.log(category);
      let span,div,span_amount,span_text;
 const isExist = document.querySelector(`.${category}`); //check element exist or not
      switch (category){
case 'Food':
        food_amount += transaction.amount;
        console.log(food_amount+"food amt");
        const food_percent = Number((food_amount*100/exp_amount).toFixed(1));
         console.log(food_percent);
        colorData.push({color:'#C79A45',percent:food_percent });
    if(!isExist){
    span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#C79A45";
    span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
    span_amount.textContent = '₹'+food_amount;
     span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Food";
     div = document.createElement('div');
    div.className = 'Food';
    console.log('checking');
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div); }
    else{
      const parent = document.querySelector('.Food');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+food_amount;
      console.log(span_amount);
    }
      break;
case 'Shopping':
    shop_amount += transaction.amount;
   const shopping_percent = Number((shop_amount * 100 / exp_amount).toFixed(1));
    colorData.push({color:'#A3453B',percent:shopping_percent});
    if(!isExist){
     span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#A3453B";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
     span_amount.textContent = '₹'+shop_amount;
       span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Shopping";
     div = document.createElement('div');
    div.className = 'Shopping';
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
    } else{
      const parent = document.querySelector('.Shopping');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+shop_amount;
    }
    break;

case 'Health':
    health_amount += transaction.amount;
    const health_percent = Number((health_amount * 100 / exp_amount).toFixed(1));
    colorData.push({color:'#4F6B4B',percent:health_percent});

    if(isExist){
    span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#4F6B4B";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
     span_amount.textContent = '₹'+health_amount;
       span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Health";
     div = document.createElement('div');
    div.className = 'Health';
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
    } else{
      const parent = document.querySelector('.Health');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+health_amount;
    }
    break;
case 'Transport':
    trans_amount += transaction.amount;
    const transport_percent = Number((trans_amount * 100 / exp_amount).toFixed(1));
    colorData.push({color:'#105732',percent:transport_percent});

    if(!isExist){
     span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#105732";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
    span_amount.textContent = '₹'+trans_amount;
       span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Transport";
     div = document.createElement('div');
    div.className = 'Transport';
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
    } else{
      const parent = document.querySelector('.Transport');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+trans_amount;
    }
    break;
case 'Education':
    Edu_amount += transaction.amount;
    const education_percent = Number((Edu_amount * 100 / exp_amount).toFixed(1));
     colorData.push({color:'#3d7186',percent: education_percent});
    if(!isExist){
     span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#3d7186";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
     span_amount.textContent = '₹'+Edu_amount;
        span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Education";
     div = document.createElement('div');
    div.className = 'Education';
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
    } else{
      const parent = document.querySelector('.Education');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+Edu_amount;
    }
    break;
case 'Bills':
    bill_amount += transaction.amount;
    const bills_percent = Number((bill_amount * 100 / exp_amount).toFixed(1));
     colorData.push({color:'#1E2A24',percent:bills_percent});
      
     if(!isExist){
     span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#1E2A24";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
     span_amount.textContent = '₹'+bill_amount;
      span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Bills";
     div = document.createElement('div');
    div.className = 'Bills';
   
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
        } else{
      const parent = document.querySelector('.Bills');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+bill_amount;
    }
    break;
case 'Other':
    other_amount += transaction.amount;
    const other_percent = Number((other_amount * 100 / exp_amount).toFixed(1));
     colorData.push({color:'#666',percent:other_percent});
      if(!isExist){
     span = document.createElement('span');
    span.className = 'color-logo';
    span.style.background = "#666";
     span_amount = document.createElement('span');
    span_amount.className = 'expense-amount';
    span_amount.textContent = '₹'+other_amount;
       span_text = document.createElement('span');
      span_text.className = 'text-span';
       span_text.textContent = "Other";
     div = document.createElement('div');
    div.className = 'Other';
    div.prepend(span);
    div.appendChild(span_text);
    div.appendChild(span_amount);
    visual_dashboard.appendChild(div);
        } else{
      const parent = document.querySelector('.Other');
      const span_amount = parent.querySelector('.expense-amount');
      span_amount.textContent = '₹'+other_amount;
    }
    break;
      }
    }
    });

    let lastend =0;
   const gradientParts = colorData.map(item=>{
      let start = lastend;
      let end = lastend + item.percent;
      lastend = end;
      console.log(item.percent);
      return `${item.color} ${start}% ${end}%`;
    })
    circle_chart.style.background = `conic-gradient(${gradientParts.join(',')})`;
}
// Calculate financial summary
function updateSummary() {

  let income = 0;
  let expense = 0;


  transactions.forEach(transaction => {

    if (transaction.type === "income") {

      income += transaction.amount;

    } else {
      expense += transaction.amount;
    }

  });


  const currentBalance = income - expense;


  totalIncome.textContent =
    `₹${income.toLocaleString("en-IN")}`;

  totalExpense.textContent =
    `₹${expense.toLocaleString("en-IN")}`;

  balance.textContent =
    `₹${currentBalance.toLocaleString("en-IN")}`;

}


// Edit transaction
function editTransaction(id) {

  const transaction = transactions.find(
    item => item.id === id
  );

  if (!transaction) return;
  descriptionInput.value = transaction.description;
  amountInput.value = transaction.amount;
  typeInput.value = transaction.type;
  categoryInput.value = transaction.category;
  dateInput.value = transaction.date;
  editId = id;

  submitBtn.textContent = "Update Transaction";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// Delete transaction
function deleteTransaction(id) {

  const confirmDelete = confirm(
    "Are you sure you want to delete this transaction?"
  );

  if (!confirmDelete) return;


  transactions = transactions.filter(
    transaction => transaction.id !== id
  );


  saveTransactions();

  displayTransactions();
  updateSummary();

}


// Category filter
filterCategory.addEventListener("change", function () {

  displayTransactions();

});


// Format date
function formatDate(date) {

  const dateObject = new Date(date);

  return dateObject.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

}




// Load data when page opens
displayTransactions();
updateSummary();