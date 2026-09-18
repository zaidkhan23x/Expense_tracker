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

const submitBtn = document.getElementById("submitBtn");

let transactions = JSON.parse(
  localStorage.getItem("transactions")
) || [];

let editId = null;


// Set today's date by default
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
// Save data in Local Storage
function saveTransactions() {

  localStorage.setItem("transactions", JSON.stringify(transactions) );

}
// Display transactions
function displayTransactions() {

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
  filteredTransactions
  .slice()
  .reverse().
forEach(transaction => {

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

    });

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