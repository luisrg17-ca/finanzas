const STORAGE_KEYS = {
  transactions: "myMoneyTransactions",
  categories: "myMoneyCategories",
  budget: "myMoneyMonthlyBudget",
  accounts: "myMoneyAccountSettings"
};

const defaultCategories = {
  expense: [
    { id: "food", name: "Food", emoji: "🍔" },
    { id: "transportation", name: "Transportation", emoji: "🚇" },
    { id: "rent", name: "Rent", emoji: "🏠" },
    { id: "shopping", name: "Shopping", emoji: "🛍️" },
    { id: "bills", name: "Bills", emoji: "🧾" },
    { id: "entertainment", name: "Entertainment", emoji: "🎬" },
    { id: "other-expense", name: "Other", emoji: "📦" }
  ],

  income: [
    { id: "salary", name: "Salary", emoji: "💼" },
    { id: "tips", name: "Tips", emoji: "💵" },
    { id: "freelance", name: "Freelance", emoji: "💻" },
    { id: "refund", name: "Refund", emoji: "↩️" },
    { id: "other-income", name: "Other", emoji: "💰" }
  ]
};

const defaultAccounts = {
  debitStartingBalance: 0,
  creditStartingDebt: 0,
  creditLimit: 0
};

let transactions = loadTransactions();
let categories = loadCategories();
let monthlyBudget = loadBudget();
let accounts = loadAccounts();

let selectedTransactionType = "expense";
let selectedPaymentMethod = "debit";
let selectedCategoryType = "expense";
let editingTransactionId = null;

/* ================================
   ELEMENTS
================================ */

const transactionForm = document.getElementById("transactionForm");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("date");

const expenseTypeBtn = document.getElementById("expenseTypeBtn");
const incomeTypeBtn = document.getElementById("incomeTypeBtn");
const paymentTypeBtn = document.getElementById("paymentTypeBtn");

const paymentMethodGroup = document.getElementById("paymentMethodGroup");
const debitMethodBtn = document.getElementById("debitMethodBtn");
const creditMethodBtn = document.getElementById("creditMethodBtn");
const cardPaymentInfo = document.getElementById("cardPaymentInfo");
const categoryGroup = document.getElementById("categoryGroup");

const submitTransactionBtn = document.getElementById("submitTransactionBtn");

const netBalanceAmount = document.getElementById("netBalanceAmount");
const debitBalanceAmount = document.getElementById("debitBalanceAmount");
const creditOwedAmount = document.getElementById("creditOwedAmount");

const debitAvailable = document.getElementById("debitAvailable");
const creditCardOwed = document.getElementById("creditCardOwed");
const creditAvailable = document.getElementById("creditAvailable");
const creditLimitDisplay = document.getElementById("creditLimitDisplay");
const creditProgressBar = document.getElementById("creditProgressBar");
const creditUsedText = document.getElementById("creditUsedText");
const creditUsedPercent = document.getElementById("creditUsedPercent");

const monthIncome = document.getElementById("monthIncome");
const monthExpenses = document.getElementById("monthExpenses");
const monthBalance = document.getElementById("monthBalance");
const monthLabel = document.getElementById("monthLabel");

const lastMonthLabel = document.getElementById("lastMonthLabel");
const currentMonthLabel = document.getElementById("currentMonthLabel");
const lastMonthSpent = document.getElementById("lastMonthSpent");
const currentMonthSpent = document.getElementById("currentMonthSpent");
const monthDifference = document.getElementById("monthDifference");
const monthDifferencePercent = document.getElementById("monthDifferencePercent");
const comparisonResult = document.getElementById("comparisonResult");
const comparisonMessage = document.getElementById("comparisonMessage");

const budgetAmount = document.getElementById("budgetAmount");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgressBar = document.getElementById("budgetProgressBar");
const budgetSpentText = document.getElementById("budgetSpentText");
const budgetPercent = document.getElementById("budgetPercent");

const transactionList = document.getElementById("transactionList");
const clearTransactionsBtn = document.getElementById("clearTransactionsBtn");

const transactionSearch = document.getElementById("transactionSearch");
const typeFilter = document.getElementById("typeFilter");
const monthFilter = document.getElementById("monthFilter");
const paymentMethodFilter = document.getElementById("paymentMethodFilter");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const settingsBtn = document.getElementById("settingsBtn");
const categoryModal = document.getElementById("categoryModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");

const debitStartingBalanceInput = document.getElementById("debitStartingBalanceInput");
const creditStartingBalanceInput = document.getElementById("creditStartingBalanceInput");
const creditLimitInput = document.getElementById("creditLimitInput");
const saveAccountsBtn = document.getElementById("saveAccountsBtn");

const categoryTabs = document.querySelectorAll(".category-tab");
const categoryForm = document.getElementById("categoryForm");
const categoryEmoji = document.getElementById("categoryEmoji");
const categoryName = document.getElementById("categoryName");
const categoryList = document.getElementById("categoryList");

const editBudgetBtn = document.getElementById("editBudgetBtn");
const monthlyBudgetInput = document.getElementById("monthlyBudgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");

const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const resetAllDataBtn = document.getElementById("resetAllDataBtn");

/* ================================
   INITIALIZE
================================ */

init();

function init() {
  migrateLegacyTransactions();
  setTodayDate();
  updateCategoryDropdown();
  updateCategoryManager();
  updateMonthLabel();
  refreshAll();
}

/* ================================
   STORAGE
================================ */

function loadTransactions() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.transactions);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load transactions:", error);
    return [];
  }
}

function loadCategories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.categories);

    if (!saved) {
      const initial = clone(defaultCategories);
      localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(saved);

    return {
      expense: Array.isArray(parsed.expense) ? parsed.expense : clone(defaultCategories.expense),
      income: Array.isArray(parsed.income) ? parsed.income : clone(defaultCategories.income)
    };
  } catch (error) {
    console.error("Could not load categories:", error);
    return clone(defaultCategories);
  }
}

function loadBudget() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.budget);
    return saved ? Number(saved) || 0 : 0;
  } catch (error) {
    console.error("Could not load budget:", error);
    return 0;
  }
}

function loadAccounts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.accounts);

    if (!saved) {
      return { ...defaultAccounts };
    }

    const parsed = JSON.parse(saved);

    return {
      debitStartingBalance: Number(parsed.debitStartingBalance) || 0,
      creditStartingDebt: Math.max(Number(parsed.creditStartingDebt) || 0, 0),
      creditLimit: Math.max(Number(parsed.creditLimit) || 0, 0)
    };
  } catch (error) {
    console.error("Could not load account settings:", error);
    return { ...defaultAccounts };
  }
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEYS.transactions, JSON.stringify(transactions));
}

function saveCategories() {
  localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(categories));
}

function saveBudget() {
  localStorage.setItem(STORAGE_KEYS.budget, String(monthlyBudget));
}

function saveAccounts() {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

/* ================================
   LEGACY MIGRATION
================================ */

function migrateLegacyTransactions() {
  let changed = false;

  transactions = transactions.map((transaction) => {
    const migrated = { ...transaction };

    if (!migrated.type) {
      migrated.type = "expense";
      changed = true;
    }

    if (migrated.type === "expense" && !migrated.paymentMethod) {
      migrated.paymentMethod = "debit";
      changed = true;
    }

    if (migrated.type === "income" && !migrated.paymentMethod) {
      migrated.paymentMethod = "debit";
      changed = true;
    }

    if (migrated.type === "payment") {
      migrated.paymentMethod = "debit";
    }

    if (!migrated.createdAt) {
      migrated.createdAt = Date.now();
      changed = true;
    }

    return migrated;
  });

  if (changed) {
    saveTransactions();
  }
}

/* ================================
   DATE
================================ */

function setTodayDate() {
  if (!dateInput.value) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.value = `${year}-${month}-${day}`;
  }
}

function updateMonthLabel() {
  const now = new Date();

  monthLabel.textContent = now.toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric"
  });
}

/* ================================
   TYPE + METHOD
================================ */

expenseTypeBtn.addEventListener("click", () => setTransactionType("expense"));
incomeTypeBtn.addEventListener("click", () => setTransactionType("income"));
paymentTypeBtn.addEventListener("click", () => setTransactionType("payment"));

debitMethodBtn.addEventListener("click", () => setPaymentMethod("debit"));
creditMethodBtn.addEventListener("click", () => setPaymentMethod("credit"));

function setTransactionType(type) {
  selectedTransactionType = type;

  [expenseTypeBtn, incomeTypeBtn, paymentTypeBtn].forEach((button) => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  const isExpense = type === "expense";
  const isPayment = type === "payment";

  paymentMethodGroup.classList.toggle("hidden", !isExpense);
  cardPaymentInfo.classList.toggle("hidden", !isPayment);
  categoryGroup.classList.toggle("hidden", isPayment);

  categorySelect.required = !isPayment;

  if (type === "income") {
    selectedPaymentMethod = "debit";
  }

  if (isPayment) {
    selectedPaymentMethod = "debit";
  }

  if (!isPayment) {
    updateCategoryDropdown();
  }

  if (editingTransactionId) {
    submitTransactionBtn.textContent = "Save Changes";
  } else {
    submitTransactionBtn.textContent =
      type === "payment" ? "+ Add Card Payment" : "+ Add Transaction";
  }
}

function setPaymentMethod(method) {
  selectedPaymentMethod = method;

  debitMethodBtn.classList.toggle("active", method === "debit");
  creditMethodBtn.classList.toggle("active", method === "credit");
}

/* ================================
   CATEGORIES
================================ */

function updateCategoryDropdown(selectedId = null) {
  if (selectedTransactionType === "payment") {
    return;
  }

  categorySelect.innerHTML = "";

  const type = selectedTransactionType === "income" ? "income" : "expense";
  const categoryArray = categories[type] || [];

  categoryArray.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = `${category.emoji || "📌"} ${category.name}`;

    if (selectedId && category.id === selectedId) {
      option.selected = true;
    }

    categorySelect.appendChild(option);
  });

  if (categoryArray.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Add a category first";
    categorySelect.appendChild(option);
  }
}

function getCategory(type, id) {
  return categories[type]?.find((category) => category.id === id) || null;
}

/* ================================
   ADD / EDIT TRANSACTION
================================ */

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (selectedTransactionType !== "payment" && !categorySelect.value) {
    alert("Please select a category.");
    return;
  }

  if (!dateInput.value) {
    alert("Please select a date.");
    return;
  }

  if (editingTransactionId) {
    updateExistingTransaction(amount);
  } else {
    createTransaction(amount);
  }
});

function createTransaction(amount) {
  const transaction = {
    id: createId(),
    type: selectedTransactionType,
    amount,
    categoryId:
      selectedTransactionType === "payment"
        ? null
        : categorySelect.value,
    description:
      descriptionInput.value.trim() ||
      (selectedTransactionType === "payment" ? "Credit Card Payment" : ""),
    date: dateInput.value,
    createdAt: Date.now(),
    paymentMethod:
      selectedTransactionType === "expense"
        ? selectedPaymentMethod
        : "debit"
  };

  transactions.push(transaction);
  saveTransactions();

  resetTransactionForm();
  refreshAll();
}

function updateExistingTransaction(amount) {
  const index = transactions.findIndex(
    (transaction) => transaction.id === editingTransactionId
  );

  if (index === -1) {
    resetTransactionForm();
    return;
  }

  transactions[index] = {
    ...transactions[index],
    type: selectedTransactionType,
    amount,
    categoryId:
      selectedTransactionType === "payment"
        ? null
        : categorySelect.value,
    description:
      descriptionInput.value.trim() ||
      (selectedTransactionType === "payment" ? "Credit Card Payment" : ""),
    date: dateInput.value,
    paymentMethod:
      selectedTransactionType === "expense"
        ? selectedPaymentMethod
        : "debit"
  };

  saveTransactions();
  resetTransactionForm();
  refreshAll();
}

function resetTransactionForm() {
  editingTransactionId = null;
  transactionForm.reset();

  selectedTransactionType = "expense";
  selectedPaymentMethod = "debit";

  setTransactionType("expense");
  setPaymentMethod("debit");
  setTodayDate();

  submitTransactionBtn.textContent = "+ Add Transaction";
}

/* ================================
   BALANCE CALCULATIONS
================================ */

function calculateAccountBalances() {
  let debitBalance = Number(accounts.debitStartingBalance) || 0;
  let creditOwed = Math.max(Number(accounts.creditStartingDebt) || 0, 0);

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      debitBalance += amount;
      return;
    }

    if (transaction.type === "expense") {
      if ((transaction.paymentMethod || "debit") === "credit") {
        creditOwed += amount;
      } else {
        debitBalance -= amount;
      }

      return;
    }

    if (transaction.type === "payment") {
      debitBalance -= amount;
      creditOwed -= amount;
    }
  });

  creditOwed = Math.max(creditOwed, 0);

  const creditLimit = Math.max(Number(accounts.creditLimit) || 0, 0);
  const creditAvailable = Math.max(creditLimit - creditOwed, 0);
  const netBalance = debitBalance - creditOwed;

  return {
    debitBalance,
    creditOwed,
    creditLimit,
    creditAvailable,
    netBalance
  };
}

function updateAccountDashboard() {
  const balances = calculateAccountBalances();

  netBalanceAmount.textContent = formatSignedBalance(balances.netBalance);

  debitBalanceAmount.textContent = formatSignedBalance(balances.debitBalance);
  debitAvailable.textContent = formatSignedBalance(balances.debitBalance);

  creditOwedAmount.textContent = formatCurrency(balances.creditOwed);
  creditCardOwed.textContent = formatCurrency(balances.creditOwed);

  creditAvailable.textContent = formatCurrency(balances.creditAvailable);
  creditLimitDisplay.textContent = formatCurrency(balances.creditLimit);

  const usagePercent =
    balances.creditLimit > 0
      ? (balances.creditOwed / balances.creditLimit) * 100
      : 0;

  const displayPercent = Math.round(usagePercent);
  const barPercent = Math.min(Math.max(usagePercent, 0), 100);

  creditProgressBar.style.width = `${barPercent}%`;
  creditUsedText.textContent = `${formatCurrency(balances.creditOwed)} used`;
  creditUsedPercent.textContent = `${displayPercent}%`;

  if (usagePercent >= 90) {
    creditProgressBar.style.background = "var(--expense)";
  } else if (usagePercent >= 70) {
    creditProgressBar.style.background = "var(--warning)";
  } else {
    creditProgressBar.style.background = "var(--primary)";
  }

  debitBalanceAmount.style.color =
    balances.debitBalance < 0 ? "#ff7c72" : "";

  debitAvailable.style.color =
    balances.debitBalance < 0 ? "var(--expense)" : "";
}

/* ================================
   MONTH SUMMARY
================================ */

function updateDashboard() {
  let currentMonthIncome = 0;
  let currentMonthExpenses = 0;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  transactions.forEach((transaction) => {
    const transactionDate = parseLocalDate(transaction.date);

    if (
      transactionDate.getFullYear() !== currentYear ||
      transactionDate.getMonth() !== currentMonth
    ) {
      return;
    }

    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      currentMonthIncome += amount;
    }

    if (transaction.type === "expense") {
      currentMonthExpenses += amount;
    }
  });

  const monthlyBalance = currentMonthIncome - currentMonthExpenses;

  monthIncome.textContent = formatCurrency(currentMonthIncome);
  monthExpenses.textContent = formatCurrency(currentMonthExpenses);
  monthBalance.textContent = formatSignedBalance(monthlyBalance);

  monthBalance.style.color =
    monthlyBalance < 0 ? "var(--expense)" : "var(--income)";
}

/* ================================
   MONTHLY BUDGET
================================ */

function updateBudget() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  let currentMonthExpenses = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") {
      return;
    }

    const transactionDate = parseLocalDate(transaction.date);

    if (
      transactionDate.getFullYear() === currentYear &&
      transactionDate.getMonth() === currentMonth
    ) {
      currentMonthExpenses += Number(transaction.amount) || 0;
    }
  });

  const remaining = monthlyBudget - currentMonthExpenses;

  const percentage =
    monthlyBudget > 0
      ? (currentMonthExpenses / monthlyBudget) * 100
      : 0;

  const displayPercentage = Math.round(percentage);
  const progressPercentage = Math.min(Math.max(percentage, 0), 100);

  budgetAmount.textContent = formatCurrency(monthlyBudget);
  budgetRemaining.textContent = formatSignedBalance(remaining);
  budgetSpentText.textContent = `${formatCurrency(currentMonthExpenses)} spent`;
  budgetPercent.textContent = `${displayPercentage}%`;
  budgetProgressBar.style.width = `${progressPercentage}%`;

  if (monthlyBudget === 0) {
    budgetRemaining.style.color = "var(--text)";
    budgetProgressBar.style.background = "var(--primary)";
  } else if (remaining < 0) {
    budgetRemaining.style.color = "var(--expense)";
    budgetProgressBar.style.background = "var(--expense)";
  } else {
    budgetRemaining.style.color = "var(--income)";
    budgetProgressBar.style.background = "var(--primary)";
  }

  monthlyBudgetInput.value = monthlyBudget || "";
}


/* ================================
   MONTH COMPARISON
================================ */

function updateMonthComparison() {
  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const previousMonthDate = new Date(currentYear, currentMonth - 1, 1);
  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth();

  let currentSpent = 0;
  let previousSpent = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") {
      return;
    }

    const date = parseLocalDate(transaction.date);
    const amount = Number(transaction.amount) || 0;

    if (
      date.getFullYear() === currentYear &&
      date.getMonth() === currentMonth
    ) {
      currentSpent += amount;
    }

    if (
      date.getFullYear() === previousYear &&
      date.getMonth() === previousMonth
    ) {
      previousSpent += amount;
    }
  });

  currentMonthLabel.textContent = now.toLocaleDateString("en-CA", {
    month: "long"
  });

  lastMonthLabel.textContent = previousMonthDate.toLocaleDateString("en-CA", {
    month: "long"
  });

  currentMonthSpent.textContent = formatCurrency(currentSpent);
  lastMonthSpent.textContent = formatCurrency(previousSpent);

  const difference = currentSpent - previousSpent;

  monthDifference.textContent = formatSignedBalance(difference);

  let percentage = 0;

  if (previousSpent > 0) {
    percentage = (difference / previousSpent) * 100;
  } else if (currentSpent > 0) {
    percentage = 100;
  }

  const roundedPercentage = Math.round(Math.abs(percentage));

  comparisonResult.classList.remove("better", "worse", "neutral");

  if (difference < 0) {
    comparisonResult.classList.add("better");
    monthDifferencePercent.textContent = `↓ ${roundedPercentage}%`;
    comparisonMessage.textContent =
      `You spent ${formatCurrency(Math.abs(difference))} less than last month.`;
  } else if (difference > 0) {
    comparisonResult.classList.add("worse");
    monthDifferencePercent.textContent = `↑ ${roundedPercentage}%`;

    if (previousSpent === 0) {
      comparisonMessage.textContent =
        `You have ${formatCurrency(currentSpent)} in expenses this month and no expenses recorded last month.`;
    } else {
      comparisonMessage.textContent =
        `You spent ${formatCurrency(difference)} more than last month.`;
    }
  } else {
    comparisonResult.classList.add("neutral");
    monthDifferencePercent.textContent = "0%";

    if (currentSpent === 0 && previousSpent === 0) {
      comparisonMessage.textContent =
        "Add expenses to compare your monthly spending.";
    } else {
      comparisonMessage.textContent =
        "Your spending is the same as last month.";
    }
  }
}

/* ================================
   TRANSACTION FILTERS
================================ */

transactionSearch.addEventListener("input", renderTransactions);
typeFilter.addEventListener("change", renderTransactions);
monthFilter.addEventListener("change", renderTransactions);
paymentMethodFilter.addEventListener("change", renderTransactions);

clearFiltersBtn.addEventListener("click", () => {
  transactionSearch.value = "";
  typeFilter.value = "all";
  monthFilter.value = "";
  paymentMethodFilter.value = "all";

  renderTransactions();
});

function getFilteredTransactions() {
  const search = transactionSearch.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedMonth = monthFilter.value;
  const selectedMethod = paymentMethodFilter.value;

  return transactions.filter((transaction) => {
    const category =
      transaction.type === "payment"
        ? null
        : getCategory(transaction.type, transaction.categoryId);

    const description = transaction.description || "";
    const categoryName = category?.name || "";
    const methodName =
      transaction.type === "payment"
        ? "credit card payment"
        : transaction.paymentMethod || "debit";

    const searchText = `${description} ${categoryName} ${methodName}`.toLowerCase();

    const matchesSearch = !search || searchText.includes(search);

    const matchesType =
      selectedType === "all" ||
      transaction.type === selectedType;

    const matchesMonth =
      !selectedMonth ||
      transaction.date.startsWith(selectedMonth);

    let matchesMethod = true;

    if (selectedMethod !== "all") {
      if (transaction.type === "expense") {
        matchesMethod =
          (transaction.paymentMethod || "debit") === selectedMethod;
      } else if (transaction.type === "income") {
        matchesMethod = selectedMethod === "debit";
      } else {
        matchesMethod = selectedMethod === "debit";
      }
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesMonth &&
      matchesMethod
    );
  });
}

/* ================================
   TRANSACTION LIST
================================ */

function renderTransactions() {
  transactionList.innerHTML = "";

  const filteredTransactions = getFilteredTransactions();

  if (transactions.length === 0) {
    transactionList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💳</div>
        <h3>No transactions yet</h3>
        <p>Add your first transaction above.</p>
      </div>
    `;
    return;
  }

  if (filteredTransactions.length === 0) {
    transactionList.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔎</div>
        <h3>No results</h3>
        <p>Try changing your search or filters.</p>
      </div>
    `;
    return;
  }

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateDifference = parseLocalDate(b.date) - parseLocalDate(a.date);

    if (dateDifference !== 0) {
      return dateDifference;
    }

    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  sortedTransactions.forEach((transaction) => {
    const item = document.createElement("div");
    item.className = "transaction-item";

    let icon = "📌";
    let title = transaction.description || "Transaction";
    let meta = formatDate(transaction.date);
    let amountText = "";
    let methodLabel = "";

    if (transaction.type === "payment") {
      icon = "↔️";
      title = transaction.description || "Credit Card Payment";
      meta = `Debit → Credit · ${formatDate(transaction.date)}`;
      amountText = `-${formatCurrency(transaction.amount)}`;
      methodLabel = "CARD PAYMENT";
    } else {
      const category = getCategory(transaction.type, transaction.categoryId);

      icon = category?.emoji || "📌";
      title = transaction.description || category?.name || "Transaction";
      meta = `${category?.name || "Category"} · ${formatDate(transaction.date)}`;

      if (transaction.type === "income") {
        amountText = `+${formatCurrency(transaction.amount)}`;
        methodLabel = "DEBIT";
      } else {
        amountText = `-${formatCurrency(transaction.amount)}`;
        methodLabel =
          (transaction.paymentMethod || "debit") === "credit"
            ? "CREDIT"
            : "DEBIT";
      }
    }

    item.innerHTML = `
      <div class="transaction-icon">
        ${escapeHTML(icon)}
      </div>

      <div class="transaction-info">
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(meta)}</p>
        <span class="transaction-method">${escapeHTML(methodLabel)}</span>
      </div>

      <div class="transaction-amount ${transaction.type}">
        ${amountText}
      </div>

      <div class="transaction-actions">
        <button
          class="small-action-btn edit-transaction"
          data-id="${transaction.id}"
          type="button"
          aria-label="Edit transaction"
        >
          ✏️
        </button>

        <button
          class="small-action-btn delete-transaction"
          data-id="${transaction.id}"
          type="button"
          aria-label="Delete transaction"
        >
          🗑️
        </button>
      </div>
    `;

    transactionList.appendChild(item);
  });

  attachTransactionActions();
}

function attachTransactionActions() {
  document
    .querySelectorAll(".edit-transaction")
    .forEach((button) => {
      button.addEventListener("click", () => {
        editTransaction(button.dataset.id);
      });
    });

  document
    .querySelectorAll(".delete-transaction")
    .forEach((button) => {
      button.addEventListener("click", () => {
        deleteTransaction(button.dataset.id);
      });
    });
}

/* ================================
   EDIT / DELETE
================================ */

function editTransaction(id) {
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return;
  }

  editingTransactionId = id;

  setTransactionType(transaction.type);

  if (transaction.type === "expense") {
    setPaymentMethod(transaction.paymentMethod || "debit");
  }

  amountInput.value = transaction.amount;
  descriptionInput.value = transaction.description || "";
  dateInput.value = transaction.date;

  if (transaction.type !== "payment") {
    updateCategoryDropdown(transaction.categoryId);
  }

  submitTransactionBtn.textContent = "Save Changes";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  setTimeout(() => {
    amountInput.focus();
  }, 300);
}

function deleteTransaction(id) {
  const transaction = transactions.find((item) => item.id === id);

  if (!transaction) {
    return;
  }

  const confirmed = confirm("Delete this transaction?");

  if (!confirmed) {
    return;
  }

  transactions = transactions.filter((item) => item.id !== id);

  saveTransactions();

  if (editingTransactionId === id) {
    resetTransactionForm();
  }

  refreshAll();
}

clearTransactionsBtn.addEventListener("click", () => {
  if (transactions.length === 0) {
    return;
  }

  const confirmed = confirm(
    "Delete all transactions? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  transactions = [];
  saveTransactions();

  resetTransactionForm();
  refreshAll();
});

/* ================================
   ACCOUNT SETTINGS
================================ */

saveAccountsBtn.addEventListener("click", () => {
  const debitStart = Number(debitStartingBalanceInput.value);
  const creditStart = Number(creditStartingBalanceInput.value);
  const creditLimit = Number(creditLimitInput.value);

  if (
    Number.isNaN(debitStart) ||
    Number.isNaN(creditStart) ||
    Number.isNaN(creditLimit) ||
    creditStart < 0 ||
    creditLimit < 0
  ) {
    alert("Please enter valid account values.");
    return;
  }

  accounts = {
    debitStartingBalance: debitStart,
    creditStartingDebt: creditStart,
    creditLimit
  };

  saveAccounts();
  updateAccountDashboard();

  alert("Account balances saved.");
});

function populateAccountSettings() {
  debitStartingBalanceInput.value =
    accounts.debitStartingBalance || "";

  creditStartingBalanceInput.value =
    accounts.creditStartingDebt || "";

  creditLimitInput.value =
    accounts.creditLimit || "";
}

/* ================================
   BUDGET SETTINGS
================================ */

saveBudgetBtn.addEventListener("click", () => {
  const value = Number(monthlyBudgetInput.value);

  if (value < 0 || Number.isNaN(value)) {
    alert("Please enter a valid budget.");
    return;
  }

  monthlyBudget = value;
  saveBudget();
  updateBudget();

  alert("Monthly budget saved.");
});

editBudgetBtn.addEventListener("click", () => {
  openSettings();

  setTimeout(() => {
    monthlyBudgetInput.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    monthlyBudgetInput.focus();
  }, 200);
});

/* ================================
   SETTINGS MODAL
================================ */

settingsBtn.addEventListener("click", openSettings);
closeModalBtn.addEventListener("click", closeSettings);
modalOverlay.addEventListener("click", closeSettings);

function openSettings() {
  categoryModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  populateAccountSettings();
  updateCategoryManager();
  updateBudget();
}

function closeSettings() {
  categoryModal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* ================================
   CATEGORY MANAGEMENT
================================ */

categoryTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedCategoryType = tab.dataset.categoryType;

    categoryTabs.forEach((button) => {
      button.classList.toggle("active", button === tab);
    });

    updateCategoryManager();
  });
});

categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = categoryName.value.trim();
  const emoji = categoryEmoji.value.trim() || "📌";

  if (!name) {
    return;
  }

  const duplicate = categories[selectedCategoryType].some(
    (category) =>
      category.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    alert("This category already exists.");
    return;
  }

  categories[selectedCategoryType].push({
    id: createId(),
    name,
    emoji
  });

  saveCategories();
  categoryForm.reset();

  updateCategoryManager();

  if (selectedTransactionType !== "payment") {
    updateCategoryDropdown();
  }

  renderTransactions();
});

function updateCategoryManager() {
  categoryList.innerHTML = "";

  const categoryArray = categories[selectedCategoryType] || [];

  if (categoryArray.length === 0) {
    categoryList.innerHTML = `
      <div class="empty-state">
        <p>No categories yet.</p>
      </div>
    `;
    return;
  }

  categoryArray.forEach((category) => {
    const item = document.createElement("div");
    item.className = "category-item";

    item.innerHTML = `
      <div class="category-item-emoji">
        ${escapeHTML(category.emoji || "📌")}
      </div>

      <div class="category-item-name">
        ${escapeHTML(category.name)}
      </div>

      <button
        class="delete-category-btn"
        data-id="${category.id}"
        type="button"
      >
        Delete
      </button>
    `;

    categoryList.appendChild(item);
  });

  document
    .querySelectorAll(".delete-category-btn")
    .forEach((button) => {
      button.addEventListener("click", () => {
        deleteCategory(button.dataset.id);
      });
    });
}

function deleteCategory(id) {
  const category = categories[selectedCategoryType].find(
    (item) => item.id === id
  );

  if (!category) {
    return;
  }

  const used = transactions.some(
    (transaction) =>
      transaction.type === selectedCategoryType &&
      transaction.categoryId === id
  );

  let message = `Delete "${category.name}"?`;

  if (used) {
    message +=
      "\n\nExisting transactions will remain, but the category will no longer be available for new transactions.";
  }

  if (!confirm(message)) {
    return;
  }

  categories[selectedCategoryType] =
    categories[selectedCategoryType].filter(
      (item) => item.id !== id
    );

  saveCategories();
  updateCategoryManager();

  if (selectedTransactionType !== "payment") {
    updateCategoryDropdown();
  }

  renderTransactions();
}


/* ================================
   RESET ALL DATA
================================ */

resetAllDataBtn.addEventListener("click", () => {
  const confirmed = confirm(
    "Delete ALL My Money data from this device? This includes transactions, categories, budget, and account balances."
  );

  if (!confirmed) {
    return;
  }

  const finalConfirmed = confirm(
    "Are you sure? This cannot be undone unless you have an exported backup."
  );

  if (!finalConfirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEYS.transactions);
  localStorage.removeItem(STORAGE_KEYS.categories);
  localStorage.removeItem(STORAGE_KEYS.budget);
  localStorage.removeItem(STORAGE_KEYS.accounts);

  transactions = [];
  categories = clone(defaultCategories);
  monthlyBudget = 0;
  accounts = { ...defaultAccounts };

  saveTransactions();
  saveCategories();
  saveBudget();
  saveAccounts();

  resetTransactionForm();

  transactionSearch.value = "";
  typeFilter.value = "all";
  monthFilter.value = "";
  paymentMethodFilter.value = "all";

  selectedCategoryType = "expense";

  categoryTabs.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.categoryType === "expense"
    );
  });

  populateAccountSettings();
  updateCategoryManager();
  updateCategoryDropdown();
  refreshAll();

  closeSettings();

  alert("All data has been deleted.");
});

/* ================================
   EXPORT BACKUP
================================ */

exportBtn.addEventListener("click", () => {
  const backup = {
    app: "My Money",
    version: 4,
    exportedAt: new Date().toISOString(),
    transactions,
    categories,
    monthlyBudget,
    accounts
  };

  const data = JSON.stringify(backup, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  const today = new Date().toISOString().split("T")[0];

  link.href = url;
  link.download = `my-money-backup-${today}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
});

/* ================================
   IMPORT BACKUP
================================ */

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = (loadEvent) => {
    try {
      const backup = JSON.parse(loadEvent.target.result);

      if (
        !Array.isArray(backup.transactions) ||
        !backup.categories ||
        !Array.isArray(backup.categories.expense) ||
        !Array.isArray(backup.categories.income)
      ) {
        throw new Error("Invalid backup");
      }

      const confirmed = confirm(
        "Import this backup? Your current data will be replaced."
      );

      if (!confirmed) {
        importInput.value = "";
        return;
      }

      transactions = backup.transactions;
      categories = backup.categories;
      monthlyBudget = Number(backup.monthlyBudget) || 0;

      accounts = backup.accounts
        ? {
            debitStartingBalance:
              Number(backup.accounts.debitStartingBalance) || 0,
            creditStartingDebt:
              Math.max(Number(backup.accounts.creditStartingDebt) || 0, 0),
            creditLimit:
              Math.max(Number(backup.accounts.creditLimit) || 0, 0)
          }
        : { ...defaultAccounts };

      migrateLegacyTransactions();

      saveTransactions();
      saveCategories();
      saveBudget();
      saveAccounts();

      resetTransactionForm();

      transactionSearch.value = "";
      typeFilter.value = "all";
      monthFilter.value = "";
      paymentMethodFilter.value = "all";

      populateAccountSettings();
      updateCategoryManager();
      refreshAll();

      alert("Backup imported successfully.");
      closeSettings();
    } catch (error) {
      console.error(error);

      alert("This file is not a valid My Money backup.");
    }

    importInput.value = "";
  };

  reader.readAsText(file);
});

/* ================================
   REFRESH
================================ */

function refreshAll() {
  renderTransactions();
  updateDashboard();
  updateBudget();
  updateAccountDashboard();
  updateMonthComparison();
}

/* ================================
   HELPERS
================================ */

function createId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2)
  );
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(Number(amount) || 0);
}

function formatSignedBalance(amount) {
  const number = Number(amount) || 0;

  if (number < 0) {
    return `-${formatCurrency(Math.abs(number))}`;
  }

  return formatCurrency(number);
}

function parseLocalDate(dateString) {
  if (!dateString) {
    return new Date();
  }

  const parts = dateString.split("-");

  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );
}

function formatDate(dateString) {
  const date = parseLocalDate(dateString);
  const currentYear = new Date().getFullYear();

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year:
      date.getFullYear() !== currentYear
        ? "numeric"
        : undefined
  });
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}
