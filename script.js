const STORAGE_KEYS = {
  transactions: "myMoneyTransactions",
  categories: "myMoneyCategories",
  budget: "myMoneyMonthlyBudget",
  accounts: "myMoneyAccounts",
  legacyAccounts: "myMoneyAccountSettings"
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

let transactions = loadTransactions();
let categories = loadCategories();
let monthlyBudget = loadBudget();
let accounts = loadAccounts();

let selectedTransactionType = "expense";
let selectedCategoryType = "expense";
let editingTransactionId = null;

/* ELEMENTS */

const $ = (id) => document.getElementById(id);

const transactionForm = $("transactionForm");
const amountInput = $("amount");
const categorySelect = $("category");
const descriptionInput = $("description");
const dateInput = $("date");

const expenseTypeBtn = $("expenseTypeBtn");
const incomeTypeBtn = $("incomeTypeBtn");
const paymentTypeBtn = $("paymentTypeBtn");

const expenseAccountGroup = $("expenseAccountGroup");
const incomeAccountGroup = $("incomeAccountGroup");
const paymentAccountsGroup = $("paymentAccountsGroup");
const categoryGroup = $("categoryGroup");

const expenseAccountSelect = $("expenseAccountSelect");
const incomeAccountSelect = $("incomeAccountSelect");
const paymentSourceSelect = $("paymentSourceSelect");
const paymentDestinationSelect = $("paymentDestinationSelect");
const submitTransactionBtn = $("submitTransactionBtn");

const netBalanceAmount = $("netBalanceAmount");
const totalDebitAmount = $("totalDebitAmount");
const totalCreditOwedAmount = $("totalCreditOwedAmount");
const debitAccountsTotal = $("debitAccountsTotal");
const creditAccountsTotal = $("creditAccountsTotal");
const debitAccountsList = $("debitAccountsList");
const creditAccountsList = $("creditAccountsList");

const monthIncome = $("monthIncome");
const monthExpenses = $("monthExpenses");
const monthBalance = $("monthBalance");
const monthLabel = $("monthLabel");

const budgetAmount = $("budgetAmount");
const budgetRemaining = $("budgetRemaining");
const budgetProgressBar = $("budgetProgressBar");
const budgetSpentText = $("budgetSpentText");
const budgetPercent = $("budgetPercent");

const lastMonthLabel = $("lastMonthLabel");
const currentMonthLabel = $("currentMonthLabel");
const lastMonthSpent = $("lastMonthSpent");
const currentMonthSpent = $("currentMonthSpent");
const monthDifference = $("monthDifference");
const monthDifferencePercent = $("monthDifferencePercent");
const comparisonResult = $("comparisonResult");
const comparisonMessage = $("comparisonMessage");

const transactionList = $("transactionList");
const clearTransactionsBtn = $("clearTransactionsBtn");
const transactionSearch = $("transactionSearch");
const typeFilter = $("typeFilter");
const monthFilter = $("monthFilter");
const accountFilter = $("accountFilter");
const clearFiltersBtn = $("clearFiltersBtn");

const settingsBtn = $("settingsBtn");
const settingsModal = $("settingsModal");
const modalOverlay = $("modalOverlay");
const closeModalBtn = $("closeModalBtn");

const showAddAccountBtn = $("showAddAccountBtn");
const addAccountPanel = $("addAccountPanel");
const newAccountName = $("newAccountName");
const newAccountType = $("newAccountType");
const newDebitFields = $("newDebitFields");
const newCreditFields = $("newCreditFields");
const newStartingBalance = $("newStartingBalance");
const newStartingDebt = $("newStartingDebt");
const newCreditLimit = $("newCreditLimit");
const saveNewAccountBtn = $("saveNewAccountBtn");
const cancelNewAccountBtn = $("cancelNewAccountBtn");
const accountsSettingsList = $("accountsSettingsList");

const categoryTabs = document.querySelectorAll(".category-tab");
const categoryForm = $("categoryForm");
const categoryEmoji = $("categoryEmoji");
const categoryName = $("categoryName");
const categoryList = $("categoryList");

const editBudgetBtn = $("editBudgetBtn");
const monthlyBudgetInput = $("monthlyBudgetInput");
const saveBudgetBtn = $("saveBudgetBtn");

const exportBtn = $("exportBtn");
const importInput = $("importInput");
const resetAllDataBtn = $("resetAllDataBtn");

/* INIT */

init();

function init() {
  migrateLegacyData();
  setTodayDate();
  updateMonthLabel();
  refreshAccountSelectors();
  updateCategoryDropdown();
  updateCategoryManager();
  refreshAll();
}

/* STORAGE */

function loadTransactions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.transactions)) || [];
  } catch {
    return [];
  }
}

function loadCategories() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories));

    return saved
      ? {
          expense: Array.isArray(saved.expense) ? saved.expense : clone(defaultCategories.expense),
          income: Array.isArray(saved.income) ? saved.income : clone(defaultCategories.income)
        }
      : clone(defaultCategories);
  } catch {
    return clone(defaultCategories);
  }
}

function loadBudget() {
  const value = Number(localStorage.getItem(STORAGE_KEYS.budget));
  return Number.isFinite(value) ? value : 0;
}

function loadAccounts() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.accounts));
    return Array.isArray(saved) ? sanitizeAccounts(saved) : [];
  } catch {
    return [];
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

/* MIGRATION */

function migrateLegacyData() {
  let changed = false;

  const legacy = localStorage.getItem(STORAGE_KEYS.legacyAccounts);

  if (accounts.length === 0 && legacy) {
    try {
      const old = JSON.parse(legacy);

      accounts.push({
        id: createId(),
        type: "debit",
        name: "Debit 1",
        startingBalance: Number(old.debitStartingBalance) || 0
      });

      accounts.push({
        id: createId(),
        type: "credit",
        name: "Credit 1",
        startingDebt: Number(old.creditStartingDebt) || 0,
        creditLimit: Math.max(Number(old.creditLimit) || 0, 0)
      });

      changed = true;
    } catch {}
  }

  if (accounts.length === 0 && transactions.length > 0) {
    accounts.push({
      id: createId(),
      type: "debit",
      name: "Debit 1",
      startingBalance: 0
    });

    accounts.push({
      id: createId(),
      type: "credit",
      name: "Credit 1",
      startingDebt: 0,
      creditLimit: 0
    });

    changed = true;
  }

  const firstDebit = accounts.find((a) => a.type === "debit");
  const firstCredit = accounts.find((a) => a.type === "credit");

  transactions = transactions.map((transaction) => {
    const item = { ...transaction };

    if (!item.createdAt) {
      item.createdAt = Date.now();
      changed = true;
    }

    if (item.type === "expense" && !item.accountId) {
      item.accountId =
        item.paymentMethod === "credit" && firstCredit
          ? firstCredit.id
          : firstDebit?.id || null;
      changed = true;
    }

    if (item.type === "income" && !item.accountId && firstDebit) {
      item.accountId = firstDebit.id;
      changed = true;
    }

    if (item.type === "payment") {
      if (!item.sourceAccountId && firstDebit) {
        item.sourceAccountId = firstDebit.id;
        changed = true;
      }

      if (!item.destinationAccountId && firstCredit) {
        item.destinationAccountId = firstCredit.id;
        changed = true;
      }
    }

    delete item.paymentMethod;
    return item;
  });

  if (changed) {
    saveAccounts();
    saveTransactions();
  }

  saveCategories();
}

function sanitizeAccounts(raw) {
  return raw
    .filter((a) => a && (a.type === "debit" || a.type === "credit"))
    .map((a) => ({
      id: a.id || createId(),
      type: a.type,
      name: String(a.name || (a.type === "debit" ? "Debit" : "Credit")).slice(0, 30),
      ...(a.type === "debit"
        ? { startingBalance: Number(a.startingBalance) || 0 }
        : {
            startingDebt: Number(a.startingDebt) || 0,
            creditLimit: Math.max(Number(a.creditLimit) || 0, 0)
          })
    }));
}

/* DATE */

function setTodayDate() {
  if (dateInput.value) return;

  const now = new Date();
  dateInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function updateMonthLabel() {
  monthLabel.textContent = new Date().toLocaleDateString("en-CA", {
    month: "long",
    year: "numeric"
  });
}

/* TYPE */

expenseTypeBtn.addEventListener("click", () => setTransactionType("expense"));
incomeTypeBtn.addEventListener("click", () => setTransactionType("income"));
paymentTypeBtn.addEventListener("click", () => setTransactionType("payment"));

function setTransactionType(type) {
  selectedTransactionType = type;

  [expenseTypeBtn, incomeTypeBtn, paymentTypeBtn].forEach((button) => {
    button.classList.toggle("active", button.dataset.type === type);
  });

  expenseAccountGroup.classList.toggle("hidden", type !== "expense");
  incomeAccountGroup.classList.toggle("hidden", type !== "income");
  paymentAccountsGroup.classList.toggle("hidden", type !== "payment");
  categoryGroup.classList.toggle("hidden", type === "payment");

  categorySelect.required = type !== "payment";

  if (type !== "payment") updateCategoryDropdown();

  submitTransactionBtn.textContent =
    editingTransactionId
      ? "Save Changes"
      : type === "payment"
        ? "+ Add Card Payment"
        : "+ Add Transaction";
}

/* ACCOUNT SELECTS */

function refreshAccountSelectors() {
  fillAccountSelect(expenseAccountSelect, accounts, "Select account");
  fillAccountSelect(incomeAccountSelect, getAccountsByType("debit"), "Select debit account");
  fillAccountSelect(paymentSourceSelect, getAccountsByType("debit"), "Select debit account");
  fillAccountSelect(paymentDestinationSelect, getAccountsByType("credit"), "Select credit account");
  updateAccountFilter();
}

function fillAccountSelect(select, list, placeholder) {
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;

  list.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.type === "credit" ? "💳" : "🏦"} ${account.name}`;
    select.appendChild(option);
  });

  if (list.some((account) => account.id === current)) {
    select.value = current;
  }
}

function updateAccountFilter() {
  const current = accountFilter.value;
  accountFilter.innerHTML = '<option value="all">All Accounts</option>';

  accounts.forEach((account) => {
    const option = document.createElement("option");
    option.value = account.id;
    option.textContent = `${account.type === "credit" ? "💳" : "🏦"} ${account.name}`;
    accountFilter.appendChild(option);
  });

  accountFilter.value =
    current === "all" || accounts.some((a) => a.id === current)
      ? current
      : "all";
}

/* CATEGORIES */

function updateCategoryDropdown(selectedId = null) {
  if (selectedTransactionType === "payment") return;

  const type = selectedTransactionType === "income" ? "income" : "expense";
  categorySelect.innerHTML = "";

  (categories[type] || []).forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = `${category.emoji || "📌"} ${category.name}`;
    if (selectedId === category.id) option.selected = true;
    categorySelect.appendChild(option);
  });
}

function getCategory(type, id) {
  return categories[type]?.find((category) => category.id === id) || null;
}

/* TRANSACTIONS */

transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const amount = Number(amountInput.value);

  if (!amount || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (selectedTransactionType === "expense") {
    if (!expenseAccountSelect.value || !categorySelect.value) {
      alert("Please select an account and category.");
      return;
    }
  }

  if (selectedTransactionType === "income") {
    if (!incomeAccountSelect.value || !categorySelect.value) {
      alert("Please select a debit account and category.");
      return;
    }
  }

  if (selectedTransactionType === "payment") {
    if (!paymentSourceSelect.value || !paymentDestinationSelect.value) {
      alert("Please select both accounts.");
      return;
    }
  }

  editingTransactionId
    ? updateExistingTransaction(amount)
    : createTransaction(amount);
});

function createTransaction(amount) {
  const item = {
    id: createId(),
    type: selectedTransactionType,
    amount,
    description: descriptionInput.value.trim(),
    date: dateInput.value,
    createdAt: Date.now()
  };

  if (item.type === "expense") {
    item.accountId = expenseAccountSelect.value;
    item.categoryId = categorySelect.value;
  }

  if (item.type === "income") {
    item.accountId = incomeAccountSelect.value;
    item.categoryId = categorySelect.value;
  }

  if (item.type === "payment") {
    item.sourceAccountId = paymentSourceSelect.value;
    item.destinationAccountId = paymentDestinationSelect.value;
    item.description = item.description || "Credit Card Payment";
  }

  transactions.push(item);
  saveTransactions();
  resetTransactionForm();
  refreshAll();
}

function updateExistingTransaction(amount) {
  const index = transactions.findIndex((item) => item.id === editingTransactionId);
  if (index < 0) return;

  const updated = {
    ...transactions[index],
    type: selectedTransactionType,
    amount,
    description: descriptionInput.value.trim(),
    date: dateInput.value
  };

  delete updated.accountId;
  delete updated.sourceAccountId;
  delete updated.destinationAccountId;
  delete updated.categoryId;

  if (updated.type === "expense") {
    updated.accountId = expenseAccountSelect.value;
    updated.categoryId = categorySelect.value;
  }

  if (updated.type === "income") {
    updated.accountId = incomeAccountSelect.value;
    updated.categoryId = categorySelect.value;
  }

  if (updated.type === "payment") {
    updated.sourceAccountId = paymentSourceSelect.value;
    updated.destinationAccountId = paymentDestinationSelect.value;
    updated.description = updated.description || "Credit Card Payment";
  }

  transactions[index] = updated;
  saveTransactions();
  resetTransactionForm();
  refreshAll();
}

function resetTransactionForm() {
  editingTransactionId = null;
  transactionForm.reset();
  setTransactionType("expense");
  setTodayDate();
}

function editTransaction(id) {
  const transaction = transactions.find((item) => item.id === id);
  if (!transaction) return;

  editingTransactionId = id;
  setTransactionType(transaction.type);

  amountInput.value = transaction.amount;
  descriptionInput.value = transaction.description || "";
  dateInput.value = transaction.date;

  if (transaction.type === "expense") {
    expenseAccountSelect.value = transaction.accountId || "";
    updateCategoryDropdown(transaction.categoryId);
  }

  if (transaction.type === "income") {
    incomeAccountSelect.value = transaction.accountId || "";
    updateCategoryDropdown(transaction.categoryId);
  }

  if (transaction.type === "payment") {
    paymentSourceSelect.value = transaction.sourceAccountId || "";
    paymentDestinationSelect.value = transaction.destinationAccountId || "";
  }

  submitTransactionBtn.textContent = "Save Changes";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteTransaction(id) {
  if (!confirm("Delete this transaction?")) return;

  transactions = transactions.filter((item) => item.id !== id);
  saveTransactions();

  if (editingTransactionId === id) resetTransactionForm();
  refreshAll();
}

clearTransactionsBtn.addEventListener("click", () => {
  if (!transactions.length) return;
  if (!confirm("Delete all transactions? This cannot be undone.")) return;

  transactions = [];
  saveTransactions();
  resetTransactionForm();
  refreshAll();
});

/* BALANCES */

function calculateAccountBalances() {
  const result = {};

  accounts.forEach((account) => {
    result[account.id] =
      account.type === "debit"
        ? { type: "debit", balance: Number(account.startingBalance) || 0 }
        : {
            type: "credit",
            debt: Number(account.startingDebt) || 0,
            creditLimit: Math.max(Number(account.creditLimit) || 0, 0)
          };
  });

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      const account = result[transaction.accountId];
      if (account?.type === "debit") account.balance += amount;
    }

    if (transaction.type === "expense") {
      const account = result[transaction.accountId];

      if (account?.type === "debit") account.balance -= amount;
      if (account?.type === "credit") account.debt += amount;
    }

    if (transaction.type === "payment") {
      const source = result[transaction.sourceAccountId];
      const destination = result[transaction.destinationAccountId];

      if (source?.type === "debit") source.balance -= amount;
      if (destination?.type === "credit") destination.debt -= amount;
    }
  });

  Object.values(result).forEach((account) => {
    if (account.type === "credit") account.debt = Math.max(account.debt, 0);
  });

  return result;
}

function getCreditActivity(accountId) {
  let activity = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "expense" && transaction.accountId === accountId) {
      activity += amount;
    }

    if (transaction.type === "payment" && transaction.destinationAccountId === accountId) {
      activity -= amount;
    }
  });

  return activity;
}

function updateAccountsDashboard() {
  const balances = calculateAccountBalances();

  const totalDebit = getAccountsByType("debit").reduce(
    (sum, account) => sum + (balances[account.id]?.balance || 0),
    0
  );

  const totalCredit = getAccountsByType("credit").reduce(
    (sum, account) => sum + (balances[account.id]?.debt || 0),
    0
  );

  netBalanceAmount.textContent = formatSignedBalance(totalDebit - totalCredit);
  totalDebitAmount.textContent = formatSignedBalance(totalDebit);
  totalCreditOwedAmount.textContent = formatCurrency(totalCredit);
  debitAccountsTotal.textContent = formatSignedBalance(totalDebit);
  creditAccountsTotal.textContent = `${formatCurrency(totalCredit)} owed`;

  renderAccountsOverview(balances);
}

function renderAccountsOverview(balances) {
  debitAccountsList.innerHTML = "";
  creditAccountsList.innerHTML = "";

  const debits = getAccountsByType("debit");
  const credits = getAccountsByType("credit");

  if (!debits.length) {
    debitAccountsList.innerHTML = '<div class="empty-state"><p>No debit accounts.</p></div>';
  }

  debits.forEach((account) => {
    const balance = balances[account.id]?.balance || 0;
    const item = document.createElement("div");
    item.className = "account-overview-item";

    item.innerHTML = `
      <div class="account-overview-top">
        <div class="account-overview-title">
          <span class="account-overview-icon">🏦</span>
          <strong>${escapeHTML(account.name)}</strong>
        </div>
        <span class="account-overview-balance">${formatSignedBalance(balance)}</span>
      </div>
      <div class="account-overview-meta">
        <span>Debit</span>
        <span>Available balance</span>
      </div>
    `;

    debitAccountsList.appendChild(item);
  });

  if (!credits.length) {
    creditAccountsList.innerHTML = '<div class="empty-state"><p>No credit accounts.</p></div>';
  }

  credits.forEach((account) => {
    const debt = balances[account.id]?.debt || 0;
    const limit = Math.max(Number(account.creditLimit) || 0, 0);
    const available = Math.max(limit - debt, 0);
    const usage = limit > 0 ? (debt / limit) * 100 : 0;

    const item = document.createElement("div");
    item.className = "account-overview-item";

    item.innerHTML = `
      <div class="account-overview-top">
        <div class="account-overview-title">
          <span class="account-overview-icon">💳</span>
          <strong>${escapeHTML(account.name)}</strong>
        </div>
        <span class="account-overview-balance">${formatCurrency(debt)} owed</span>
      </div>
      <div class="account-credit-progress">
        <div class="account-credit-progress-bar" style="width:${Math.min(Math.max(usage, 0), 100)}%"></div>
      </div>
      <div class="account-overview-meta">
        <span>Available ${formatCurrency(available)}</span>
        <span>Limit ${formatCurrency(limit)}</span>
      </div>
    `;

    creditAccountsList.appendChild(item);
  });
}

/* MONTH */

function updateDashboard() {
  const now = new Date();
  let income = 0;
  let expenses = 0;

  transactions.forEach((transaction) => {
    const date = parseLocalDate(transaction.date);

    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      const amount = Number(transaction.amount) || 0;
      if (transaction.type === "income") income += amount;
      if (transaction.type === "expense") expenses += amount;
    }
  });

  monthIncome.textContent = formatCurrency(income);
  monthExpenses.textContent = formatCurrency(expenses);
  monthBalance.textContent = formatSignedBalance(income - expenses);
  monthBalance.style.color = income - expenses < 0 ? "var(--expense)" : "var(--income)";
}

function updateBudget() {
  const now = new Date();
  let spent = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;
    const date = parseLocalDate(transaction.date);

    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      spent += Number(transaction.amount) || 0;
    }
  });

  const remaining = monthlyBudget - spent;
  const percentage = monthlyBudget > 0 ? (spent / monthlyBudget) * 100 : 0;

  budgetAmount.textContent = formatCurrency(monthlyBudget);
  budgetRemaining.textContent = formatSignedBalance(remaining);
  budgetSpentText.textContent = `${formatCurrency(spent)} spent`;
  budgetPercent.textContent = `${Math.round(percentage)}%`;
  budgetProgressBar.style.width = `${Math.min(Math.max(percentage, 0), 100)}%`;
  budgetProgressBar.style.background = remaining < 0 ? "var(--expense)" : "var(--primary)";
  budgetRemaining.style.color =
    monthlyBudget === 0 ? "var(--text)" : remaining < 0 ? "var(--expense)" : "var(--income)";

  monthlyBudgetInput.value = monthlyBudget || "";
}

function updateMonthComparison() {
  const now = new Date();
  const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  let currentSpent = 0;
  let previousSpent = 0;

  transactions.forEach((transaction) => {
    if (transaction.type !== "expense") return;

    const date = parseLocalDate(transaction.date);
    const amount = Number(transaction.amount) || 0;

    if (date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()) {
      currentSpent += amount;
    }

    if (date.getFullYear() === previous.getFullYear() && date.getMonth() === previous.getMonth()) {
      previousSpent += amount;
    }
  });

  currentMonthLabel.textContent = now.toLocaleDateString("en-CA", { month: "long" });
  lastMonthLabel.textContent = previous.toLocaleDateString("en-CA", { month: "long" });
  currentMonthSpent.textContent = formatCurrency(currentSpent);
  lastMonthSpent.textContent = formatCurrency(previousSpent);

  const difference = currentSpent - previousSpent;
  const percentage =
    previousSpent > 0
      ? (difference / previousSpent) * 100
      : currentSpent > 0
        ? 100
        : 0;

  monthDifference.textContent = formatSignedBalance(difference);
  comparisonResult.classList.remove("better", "worse", "neutral");

  if (difference < 0) {
    comparisonResult.classList.add("better");
    monthDifferencePercent.textContent = `↓ ${Math.round(Math.abs(percentage))}%`;
    comparisonMessage.textContent = `You spent ${formatCurrency(Math.abs(difference))} less than last month.`;
  } else if (difference > 0) {
    comparisonResult.classList.add("worse");
    monthDifferencePercent.textContent = `↑ ${Math.round(Math.abs(percentage))}%`;
    comparisonMessage.textContent =
      previousSpent === 0
        ? `You have ${formatCurrency(currentSpent)} in expenses this month and no expenses recorded last month.`
        : `You spent ${formatCurrency(difference)} more than last month.`;
  } else {
    comparisonResult.classList.add("neutral");
    monthDifferencePercent.textContent = "0%";
    comparisonMessage.textContent =
      currentSpent === 0 && previousSpent === 0
        ? "Add expenses to compare your monthly spending."
        : "Your spending is the same as last month.";
  }
}

/* FILTERS */

transactionSearch.addEventListener("input", renderTransactions);
typeFilter.addEventListener("change", renderTransactions);
monthFilter.addEventListener("change", renderTransactions);
accountFilter.addEventListener("change", renderTransactions);

clearFiltersBtn.addEventListener("click", () => {
  transactionSearch.value = "";
  typeFilter.value = "all";
  monthFilter.value = "";
  accountFilter.value = "all";
  renderTransactions();
});

function getFilteredTransactions() {
  const search = transactionSearch.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const selectedMonth = monthFilter.value;
  const selectedAccount = accountFilter.value;

  return transactions.filter((transaction) => {
    const category =
      transaction.type === "payment"
        ? null
        : getCategory(transaction.type, transaction.categoryId);

    const accountNames = getTransactionAccountIds(transaction)
      .map((id) => getAccountById(id)?.name || "")
      .join(" ");

    const text = `${transaction.description || ""} ${category?.name || ""} ${accountNames}`.toLowerCase();

    return (
      (!search || text.includes(search)) &&
      (selectedType === "all" || transaction.type === selectedType) &&
      (!selectedMonth || transaction.date.startsWith(selectedMonth)) &&
      (selectedAccount === "all" || getTransactionAccountIds(transaction).includes(selectedAccount))
    );
  });
}

/* TRANSACTION LIST */

function renderTransactions() {
  transactionList.innerHTML = "";

  const filtered = getFilteredTransactions();

  if (!transactions.length) {
    transactionList.innerHTML = '<div class="empty-state"><div class="empty-icon">💳</div><h3>No transactions yet</h3><p>Add your first transaction above.</p></div>';
    return;
  }

  if (!filtered.length) {
    transactionList.innerHTML = '<div class="empty-state"><div class="empty-icon">🔎</div><h3>No results</h3><p>Try changing your filters.</p></div>';
    return;
  }

  [...filtered]
    .sort((a, b) => parseLocalDate(b.date) - parseLocalDate(a.date) || (b.createdAt || 0) - (a.createdAt || 0))
    .forEach((transaction) => {
      const item = document.createElement("div");
      item.className = "transaction-item";

      let icon = "📌";
      let title = transaction.description || "Transaction";
      let meta = formatDate(transaction.date);
      let accountLabel = "";
      let amountText = "";

      if (transaction.type === "payment") {
        const source = getAccountById(transaction.sourceAccountId);
        const destination = getAccountById(transaction.destinationAccountId);

        icon = "↔️";
        title = transaction.description || "Credit Card Payment";
        meta = `${source?.name || "Debit"} → ${destination?.name || "Credit"} · ${formatDate(transaction.date)}`;
        accountLabel = `${source?.name || "Debit"} → ${destination?.name || "Credit"}`;
        amountText = `-${formatCurrency(transaction.amount)}`;
      } else {
        const category = getCategory(transaction.type, transaction.categoryId);
        const account = getAccountById(transaction.accountId);

        icon = category?.emoji || "📌";
        title = transaction.description || category?.name || "Transaction";
        meta = `${category?.name || "Category"} · ${formatDate(transaction.date)}`;
        accountLabel = account?.name || "Account";
        amountText =
          transaction.type === "income"
            ? `+${formatCurrency(transaction.amount)}`
            : `-${formatCurrency(transaction.amount)}`;
      }

      item.innerHTML = `
        <div class="transaction-icon">${escapeHTML(icon)}</div>
        <div class="transaction-info">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(meta)}</p>
          <span class="transaction-method">${escapeHTML(accountLabel)}</span>
        </div>
        <div class="transaction-amount ${transaction.type}">${amountText}</div>
        <div class="transaction-actions">
          <button class="small-action-btn edit-transaction" data-id="${transaction.id}" type="button">✏️</button>
          <button class="small-action-btn delete-transaction" data-id="${transaction.id}" type="button">🗑️</button>
        </div>
      `;

      transactionList.appendChild(item);
    });

  document.querySelectorAll(".edit-transaction").forEach((button) => {
    button.addEventListener("click", () => editTransaction(button.dataset.id));
  });

  document.querySelectorAll(".delete-transaction").forEach((button) => {
    button.addEventListener("click", () => deleteTransaction(button.dataset.id));
  });
}

/* SETTINGS */

settingsBtn.addEventListener("click", openSettings);
closeModalBtn.addEventListener("click", closeSettings);
modalOverlay.addEventListener("click", closeSettings);

function openSettings() {
  settingsModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  renderAccountSettings();
  updateCategoryManager();
  updateBudget();
}

function closeSettings() {
  settingsModal.classList.add("hidden");
  document.body.style.overflow = "";
}

/* DYNAMIC ACCOUNTS */

showAddAccountBtn.addEventListener("click", () => {
  addAccountPanel.classList.remove("hidden");
});

cancelNewAccountBtn.addEventListener("click", resetNewAccountForm);

newAccountType.addEventListener("change", () => {
  const isCredit = newAccountType.value === "credit";
  newDebitFields.classList.toggle("hidden", isCredit);
  newCreditFields.classList.toggle("hidden", !isCredit);
});

saveNewAccountBtn.addEventListener("click", () => {
  const name = newAccountName.value.trim();
  const type = newAccountType.value;

  if (!name) {
    alert("Please enter an account name.");
    return;
  }

  const account = {
    id: createId(),
    type,
    name: name.slice(0, 30)
  };

  if (type === "debit") {
    const currentBalance = Number(newStartingBalance.value);

    if (Number.isNaN(currentBalance)) {
      alert("Please enter a valid balance.");
      return;
    }

    account.startingBalance = currentBalance;
  } else {
    const currentDebt = Number(newStartingDebt.value);
    const limit = Number(newCreditLimit.value);

    if (
      Number.isNaN(currentDebt) ||
      Number.isNaN(limit) ||
      currentDebt < 0 ||
      limit < 0
    ) {
      alert("Please enter valid credit values.");
      return;
    }

    account.startingDebt = currentDebt;
    account.creditLimit = limit;
  }

  accounts.push(account);
  saveAccounts();

  resetNewAccountForm();
  refreshAccountSelectors();
  renderAccountSettings();
  refreshAll();
});

function resetNewAccountForm() {
  newAccountName.value = "";
  newAccountType.value = "debit";
  newStartingBalance.value = "";
  newStartingDebt.value = "";
  newCreditLimit.value = "";
  newDebitFields.classList.remove("hidden");
  newCreditFields.classList.add("hidden");
  addAccountPanel.classList.add("hidden");
}

function renderAccountSettings() {
  const balances = calculateAccountBalances();
  accountsSettingsList.innerHTML = "";

  if (!accounts.length) {
    accountsSettingsList.innerHTML = '<div class="empty-state"><p>No accounts yet. Use + Add to create one.</p></div>';
    return;
  }

  accounts.forEach((account) => {
    const card = document.createElement("div");
    card.className = "account-settings-card";

    const currentValue =
      account.type === "debit"
        ? balances[account.id]?.balance || 0
        : balances[account.id]?.debt || 0;

    card.innerHTML = `
      <div class="account-settings-card-header">
        <strong>${escapeHTML(account.name)}</strong>
        <span class="account-type-badge">${account.type.toUpperCase()}</span>
      </div>

      <div class="account-settings-grid">
        <div class="account-settings-field">
          <label>Account Name</label>
          <input class="account-name-input" data-id="${account.id}" type="text" maxlength="30" value="${escapeAttribute(account.name)}" />
        </div>

        ${
          account.type === "debit"
            ? `
              <div class="account-settings-field">
                <label>Current Balance</label>
                <input class="account-current-balance-input" data-id="${account.id}" type="number" step="0.01" value="${currentValue.toFixed(2)}" />
              </div>
            `
            : `
              <div class="account-settings-field">
                <label>Current Owed</label>
                <input class="account-current-debt-input" data-id="${account.id}" type="number" min="0" step="0.01" value="${currentValue.toFixed(2)}" />
              </div>

              <div class="account-settings-field">
                <label>Credit Limit</label>
                <input class="account-credit-limit-input" data-id="${account.id}" type="number" min="0" step="0.01" value="${(Number(account.creditLimit) || 0).toFixed(2)}" />
              </div>
            `
        }
      </div>

      <div class="account-settings-actions">
        <button class="save-account-btn" data-id="${account.id}" type="button">Save Changes</button>
        <button class="delete-account-btn" data-id="${account.id}" type="button">Delete</button>
      </div>
    `;

    accountsSettingsList.appendChild(card);
  });

  document.querySelectorAll(".save-account-btn").forEach((button) => {
    button.addEventListener("click", () => saveAccountChanges(button.dataset.id));
  });

  document.querySelectorAll(".delete-account-btn").forEach((button) => {
    button.addEventListener("click", () => deleteAccount(button.dataset.id));
  });
}

function saveAccountChanges(accountId) {
  const account = getAccountById(accountId);
  if (!account) return;

  const nameInput = document.querySelector(`.account-name-input[data-id="${accountId}"]`);
  const newName = nameInput.value.trim();

  if (!newName) {
    alert("Please enter an account name.");
    return;
  }

  account.name = newName.slice(0, 30);

  if (account.type === "debit") {
    const input = document.querySelector(`.account-current-balance-input[data-id="${accountId}"]`);
    const desiredCurrentBalance = Number(input.value);

    if (Number.isNaN(desiredCurrentBalance)) {
      alert("Please enter a valid balance.");
      return;
    }

    const activity = getDebitActivity(accountId);
    account.startingBalance = desiredCurrentBalance - activity;
  }

  if (account.type === "credit") {
    const debtInput = document.querySelector(`.account-current-debt-input[data-id="${accountId}"]`);
    const limitInput = document.querySelector(`.account-credit-limit-input[data-id="${accountId}"]`);

    const desiredCurrentDebt = Number(debtInput.value);
    const limit = Number(limitInput.value);

    if (
      Number.isNaN(desiredCurrentDebt) ||
      Number.isNaN(limit) ||
      desiredCurrentDebt < 0 ||
      limit < 0
    ) {
      alert("Please enter valid credit values.");
      return;
    }

    const activity = getCreditActivity(accountId);

    // Adjust the internal baseline so the displayed current debt equals the user's value.
    account.startingDebt = desiredCurrentDebt - activity;
    account.creditLimit = limit;
  }

  saveAccounts();
  refreshAccountSelectors();
  renderAccountSettings();
  refreshAll();

  alert("Account updated.");
}

function deleteAccount(accountId) {
  const account = getAccountById(accountId);
  if (!account) return;

  const used = transactions.some((transaction) =>
    getTransactionAccountIds(transaction).includes(accountId)
  );

  const message = used
    ? `"${account.name}" has transactions linked to it. Delete the account anyway? Those transactions will remain in history but will show as an unavailable account.`
    : `Delete "${account.name}"?`;

  if (!confirm(message)) return;

  accounts = accounts.filter((item) => item.id !== accountId);
  saveAccounts();

  refreshAccountSelectors();
  renderAccountSettings();
  refreshAll();
}

function getDebitActivity(accountId) {
  let activity = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income" && transaction.accountId === accountId) {
      activity += amount;
    }

    if (transaction.type === "expense" && transaction.accountId === accountId) {
      activity -= amount;
    }

    if (transaction.type === "payment" && transaction.sourceAccountId === accountId) {
      activity -= amount;
    }
  });

  return activity;
}

function getCreditActivity(accountId) {
  let activity = 0;

  transactions.forEach((transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "expense" && transaction.accountId === accountId) {
      activity += amount;
    }

    if (transaction.type === "payment" && transaction.destinationAccountId === accountId) {
      activity -= amount;
    }
  });

  return activity;
}

/* BUDGET */

saveBudgetBtn.addEventListener("click", () => {
  const value = Number(monthlyBudgetInput.value);

  if (Number.isNaN(value) || value < 0) {
    alert("Please enter a valid budget.");
    return;
  }

  monthlyBudget = value;
  saveBudget();
  updateBudget();
});

editBudgetBtn.addEventListener("click", () => {
  openSettings();

  setTimeout(() => {
    monthlyBudgetInput.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 150);
});

/* CATEGORIES */

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

  if (!name) return;

  if (
    categories[selectedCategoryType].some(
      (category) => category.name.toLowerCase() === name.toLowerCase()
    )
  ) {
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
  updateCategoryDropdown();
});

function updateCategoryManager() {
  categoryList.innerHTML = "";

  (categories[selectedCategoryType] || []).forEach((category) => {
    const item = document.createElement("div");
    item.className = "category-item";

    item.innerHTML = `
      <div class="category-item-emoji">${escapeHTML(category.emoji || "📌")}</div>
      <div class="category-item-name">${escapeHTML(category.name)}</div>
      <button class="delete-category-btn" data-id="${category.id}" type="button">Delete</button>
    `;

    categoryList.appendChild(item);
  });

  document.querySelectorAll(".delete-category-btn").forEach((button) => {
    button.addEventListener("click", () => {
      categories[selectedCategoryType] = categories[selectedCategoryType].filter(
        (category) => category.id !== button.dataset.id
      );

      saveCategories();
      updateCategoryManager();
      updateCategoryDropdown();
      renderTransactions();
    });
  });
}

/* BACKUP */

exportBtn.addEventListener("click", () => {
  const backup = {
    app: "My Money",
    version: 6,
    exportedAt: new Date().toISOString(),
    transactions,
    categories,
    monthlyBudget,
    accounts
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `my-money-backup-${new Date().toISOString().split("T")[0]}.json`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (loadEvent) => {
    try {
      const backup = JSON.parse(loadEvent.target.result);

      if (!Array.isArray(backup.transactions) || !backup.categories) {
        throw new Error("Invalid backup");
      }

      if (!confirm("Import this backup? Current data will be replaced.")) {
        importInput.value = "";
        return;
      }

      transactions = backup.transactions;
      categories = backup.categories;
      monthlyBudget = Number(backup.monthlyBudget) || 0;
      accounts = Array.isArray(backup.accounts) ? sanitizeAccounts(backup.accounts) : [];

      saveTransactions();
      saveCategories();
      saveBudget();
      saveAccounts();

      migrateLegacyData();
      refreshAccountSelectors();
      updateCategoryManager();
      refreshAll();
      renderAccountSettings();
      closeSettings();

      alert("Backup imported successfully.");
    } catch {
      alert("Invalid backup file.");
    }

    importInput.value = "";
  };

  reader.readAsText(file);
});

/* RESET */

resetAllDataBtn.addEventListener("click", () => {
  if (!confirm("Delete ALL data from this device?")) return;
  if (!confirm("This cannot be undone unless you have a backup. Continue?")) return;

  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));

  transactions = [];
  categories = clone(defaultCategories);
  monthlyBudget = 0;
  accounts = [];

  saveTransactions();
  saveCategories();
  saveBudget();
  saveAccounts();

  refreshAccountSelectors();
  updateCategoryManager();
  refreshAll();
  closeSettings();

  alert("All data has been deleted.");
});

/* REFRESH */

function refreshAll() {
  updateAccountsDashboard();
  updateDashboard();
  updateBudget();
  updateMonthComparison();
  renderTransactions();
}

/* HELPERS */

function getAccountsByType(type) {
  return accounts.filter((account) => account.type === type);
}

function getAccountById(id) {
  return accounts.find((account) => account.id === id) || null;
}

function getTransactionAccountIds(transaction) {
  return transaction.type === "payment"
    ? [transaction.sourceAccountId, transaction.destinationAccountId].filter(Boolean)
    : transaction.accountId
      ? [transaction.accountId]
      : [];
}

function createId() {
  return crypto?.randomUUID
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
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
  return number < 0
    ? `-${formatCurrency(Math.abs(number))}`
    : formatCurrency(number);
}

function parseLocalDate(dateString) {
  if (!dateString) return new Date();

  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateString) {
  const date = parseLocalDate(dateString);

  return date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
  });
}

function escapeHTML(value) {
  const div = document.createElement("div");
  div.textContent = value == null ? "" : String(value);
  return div.innerHTML;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
