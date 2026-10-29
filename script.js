
const expenseForm = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");

const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const expenseCount = document.getElementById("expenseCount");
const emptyMessage = document.getElementById("emptyMessage");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const clearBtn = document.getElementById("clearBtn");
const formHeading = document.getElementById("formHeading");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let editingId = null;

// Save expenses in LocalStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display expenses and update total
function renderExpenses() {
    expenseList.textContent = "";

    let total = 0;

    expenses.forEach(function (expense) {
        total += expense.amount;

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;

        const amountCell = document.createElement("td");
        amountCell.textContent = "₹" + expense.amount.toFixed(2);

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const actionsCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", function () {
            editExpense(expense.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", function () {
            deleteExpense(expense.id);
        });

        actionsCell.append(editButton, deleteButton);
        row.append(titleCell, amountCell, categoryCell, actionsCell);
        expenseList.appendChild(row);
    });

    totalAmount.textContent = "₹" + total.toFixed(2);
    expenseCount.textContent =
        expenses.length + (expenses.length === 1
            ? " expense recorded"
            : " expenses recorded");

    emptyMessage.hidden = expenses.length !== 0;
    clearBtn.hidden = expenses.length === 0;
}

// Add a new expense or update an existing one
expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;

    if (!title || !category || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid title, amount and category.");
        return;
    }

    if (editingId !== null) {
        expenses = expenses.map(function (expense) {
            if (expense.id === editingId) {
                return {
                    ...expense,
                    title: title,
                    amount: amount,
                    category: category
                };
            }
            return expense;
        });
    } else {
        const newExpense = {
            id: Date.now(),
            title: title,
            amount: amount,
            category: category
        };

        expenses.push(newExpense);
    }

    saveExpenses();
    renderExpenses();
    resetForm();
});

// Load an expense into the form for editing
function editExpense(id) {
    const expense = expenses.find(function (item) {
        return item.id === id;
    });

    if (!expense) return;

    editingId = id;
    titleInput.value = expense.title;
    amountInput.value = expense.amount;
    categoryInput.value = expense.category;

    formHeading.textContent = "Edit Expense";
    submitBtn.textContent = "Update Expense";
    cancelBtn.hidden = false;

    titleInput.focus();
}

// Delete an expense
function deleteExpense(id) {
    const confirmed = confirm("Are you sure you want to delete this expense?");

    if (!confirmed) return;

    expenses = expenses.filter(function (expense) {
        return expense.id !== id;
    });

    saveExpenses();
    renderExpenses();

    if (editingId === id) {
        resetForm();
    }
}

// Reset the form after adding or cancelling an edit
function resetForm() {
    expenseForm.reset();
    editingId = null;
    formHeading.textContent = "Add New Expense";
    submitBtn.textContent = "Add Expense";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);

// Delete all expenses
clearBtn.addEventListener("click", function () {
    if (expenses.length === 0) return;

    const confirmed = confirm("Delete ALL your expenses?");

    if (!confirmed) return;

    expenses = [];
    saveExpenses();
    renderExpenses();
    resetForm();
});

// Load previously saved data when the page opens
renderExpenses();
