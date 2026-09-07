const STORAGE_KEYS = {
  transactions: "myMoneyTransactions",
  categories: "myMoneyCategories",
  budget: "myMoneyMonthlyBudget"
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

let selectedTransactionType = "expense";
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

const balanceAmount = document.getElementById("balanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

const monthIncome = document.getElementById("monthIncome");
const monthExpenses = document.getElementById("monthExpenses");
const monthBalance = document.getElementById("monthBalance");
const monthLabel = document.getElementById("monthLabel");

const transactionList = document.getElementById("transactionList");
const clearTransactionsBtn = document.getElementById("clearTransactionsBtn");

const settingsBtn = document.getElementById("settingsBtn");
const categoryModal = document.getElementById("categoryModal");
const modalOverlay = document.getElementById("modalOverlay");
const closeModalBtn = document.getElementById("closeModalBtn");

const categoryTabs = document.querySelectorAll(".category-tab");

const categoryForm = document.getElementById("categoryForm");
const categoryEmoji = document.getElementById("categoryEmoji");
const categoryName = document.getElementById("categoryName");
const categoryList = document.getElementById("categoryList");

const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");

const submitTransactionBtn =
  transactionForm.querySelector(".primary-btn");

/* BUDGET */

const budgetAmount = document.getElementById("budgetAmount");
const budgetRemaining = document.getElementById("budgetRemaining");
const budgetProgressBar = document.getElementById("budgetProgressBar");
const budgetSpentText = document.getElementById("budgetSpentText");
const budgetPercent = document.getElementById("budgetPercent");

const editBudgetBtn = document.getElementById("editBudgetBtn");
const monthlyBudgetInput = document.getElementById("monthlyBudgetInput");
const saveBudgetBtn = document.getElementById("saveBudgetBtn");


/* ================================
   INITIALIZE
================================ */

init();

function init() {
  setTodayDate();
  updateCategoryDropdown();
  updateCategoryManager();
  renderTransactions();
  updateDashboard();
  updateMonthLabel();
  updateBudget();
}


/* ================================
   STORAGE
================================ */

function loadTransactions() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEYS.transactions);

    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error(
      "Could not load transactions:",
      error
    );

    return [];
  }
}


function loadCategories() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEYS.categories);

    if (!saved) {
      localStorage.setItem(
        STORAGE_KEYS.categories,
        JSON.stringify(defaultCategories)
      );

      return JSON.parse(
        JSON.stringify(defaultCategories)
      );
    }

    return JSON.parse(saved);

  } catch (error) {
    console.error(
      "Could not load categories:",
      error
    );

    return JSON.parse(
      JSON.stringify(defaultCategories)
    );
  }
}


function loadBudget() {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEYS.budget);

    return saved ? Number(saved) : 0;

  } catch (error) {
    console.error(
      "Could not load budget:",
      error
    );

    return 0;
  }
}


function saveTransactions() {
  localStorage.setItem(
    STORAGE_KEYS.transactions,
    JSON.stringify(transactions)
  );
}


function saveCategories() {
  localStorage.setItem(
    STORAGE_KEYS.categories,
    JSON.stringify(categories)
  );
}


function saveBudget() {
  localStorage.setItem(
    STORAGE_KEYS.budget,
    String(monthlyBudget)
  );
}


/* ================================
   DATE
================================ */

function setTodayDate() {
  if (!dateInput.value) {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(today.getMonth() + 1)
        .padStart(2, "0");

    const day =
      String(today.getDate())
        .padStart(2, "0");

    dateInput.value =
      `${year}-${month}-${day}`;
  }
}


function updateMonthLabel() {

  const now = new Date();

  monthLabel.textContent =
    now.toLocaleDateString(
      "en-CA",
      {
        month: "long",
        year: "numeric"
      }
    );
}


/* ================================
   TRANSACTION TYPE
================================ */

expenseTypeBtn.addEventListener(
  "click",
  () => {
    setTransactionType("expense");
  }
);


incomeTypeBtn.addEventListener(
  "click",
  () => {
    setTransactionType("income");
  }
);


function setTransactionType(type) {

  selectedTransactionType = type;

  expenseTypeBtn.classList.toggle(
    "active",
    type === "expense"
  );

  incomeTypeBtn.classList.toggle(
    "active",
    type === "income"
  );

  updateCategoryDropdown();
}


/* ================================
   CATEGORY DROPDOWN
================================ */

function updateCategoryDropdown(
  selectedId = null
) {

  categorySelect.innerHTML = "";

  const categoryArray =
    categories[selectedTransactionType] || [];

  categoryArray.forEach(
    (category) => {

      const option =
        document.createElement("option");

      option.value =
        category.id;

      option.textContent =
        `${category.emoji || "📌"} ${category.name}`;

      if (
        selectedId &&
        category.id === selectedId
      ) {
        option.selected = true;
      }

      categorySelect.appendChild(option);
    }
  );


  if (categoryArray.length === 0) {

    const option =
      document.createElement("option");

    option.value = "";

    option.textContent =
      "Add a category first";

    categorySelect.appendChild(option);
  }
}


/* ================================
   ADD / EDIT TRANSACTION
================================ */

transactionForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();

    const amount =
      Number(amountInput.value);

    if (!amount || amount <= 0) {

      alert(
        "Please enter a valid amount."
      );

      return;
    }


    if (!categorySelect.value) {

      alert(
        "Please select a category."
      );

      return;
    }


    if (editingTransactionId) {

      updateExistingTransaction(
        amount
      );

    } else {

      createTransaction(
        amount
      );
    }
  }
);


function createTransaction(amount) {

  const transaction = {

    id: createId(),

    type:
      selectedTransactionType,

    amount:
      amount,

    categoryId:
      categorySelect.value,

    description:
      descriptionInput.value.trim(),

    date:
      dateInput.value,

    createdAt:
      Date.now()
  };


  transactions.push(
    transaction
  );


  saveTransactions();

  resetTransactionForm();

  renderTransactions();

  updateDashboard();

  updateBudget();
}


function updateExistingTransaction(amount) {

  const transactionIndex =
    transactions.findIndex(
      (transaction) =>
        transaction.id ===
        editingTransactionId
    );


  if (transactionIndex === -1) {

    resetTransactionForm();

    return;
  }


  transactions[transactionIndex] = {

    ...transactions[
      transactionIndex
    ],

    type:
      selectedTransactionType,

    amount:
      amount,

    categoryId:
      categorySelect.value,

    description:
      descriptionInput.value.trim(),

    date:
      dateInput.value
  };


  saveTransactions();

  resetTransactionForm();

  renderTransactions();

  updateDashboard();

  updateBudget();
}


/* ================================
   RESET FORM
================================ */

function resetTransactionForm() {

  editingTransactionId = null;

  transactionForm.reset();

  selectedTransactionType =
    "expense";

  setTransactionType(
    "expense"
  );

  setTodayDate();

  submitTransactionBtn.textContent =
    "+ Add Transaction";
}


/* ================================
   TRANSACTION LIST
================================ */

function renderTransactions() {

  transactionList.innerHTML = "";


  if (transactions.length === 0) {

    transactionList.innerHTML = `
      <div class="empty-state">

        <div class="empty-icon">
          💳
        </div>

        <h3>
          No transactions yet
        </h3>

        <p>
          Add your first income or expense above.
        </p>

      </div>
    `;

    return;
  }


  const sortedTransactions =
    [...transactions].sort(
      (a, b) => {

        const dateDifference =
          new Date(b.date) -
          new Date(a.date);

        if (
          dateDifference !== 0
        ) {
          return dateDifference;
        }

        return (
          (b.createdAt || 0) -
          (a.createdAt || 0)
        );
      }
    );


  sortedTransactions.forEach(
    (transaction) => {

      const category =
        getCategory(
          transaction.type,
          transaction.categoryId
        );


      const item =
        document.createElement("div");

      item.className =
        "transaction-item";


      const sign =
        transaction.type === "income"
          ? "+"
          : "-";


      item.innerHTML = `

        <div class="transaction-icon">
          ${escapeHTML(category?.emoji || "📌")}
        </div>

        <div class="transaction-info">

          <h3>
            ${escapeHTML(
              transaction.description ||
              category?.name ||
              "Transaction"
            )}
          </h3>

          <p>
            ${escapeHTML(
              category?.name ||
              "Category"
            )}
            ·
            ${formatDate(
              transaction.date
            )}
          </p>

        </div>

        <div
          class="transaction-amount
          ${transaction.type}"
        >

          ${sign}${formatCurrency(
            transaction.amount
          )}

        </div>

        <div class="transaction-actions">

          <button
            class="small-action-btn edit-transaction"
            data-id="${transaction.id}"
            aria-label="Edit transaction"
          >
            ✏️
          </button>

          <button
            class="small-action-btn delete-transaction"
            data-id="${transaction.id}"
            aria-label="Delete transaction"
          >
            🗑️
          </button>

        </div>
      `;


      transactionList.appendChild(
        item
      );
    }
  );


  attachTransactionActions();
}


function attachTransactionActions() {

  document
    .querySelectorAll(
      ".edit-transaction"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            editTransaction(
              button.dataset.id
            );

          }
        );
      }
    );


  document
    .querySelectorAll(
      ".delete-transaction"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            deleteTransaction(
              button.dataset.id
            );

          }
        );
      }
    );
}


/* ================================
   EDIT TRANSACTION
================================ */

function editTransaction(id) {

  const transaction =
    transactions.find(
      (item) =>
        item.id === id
    );


  if (!transaction) return;


  editingTransactionId =
    id;


  setTransactionType(
    transaction.type
  );


  amountInput.value =
    transaction.amount;


  descriptionInput.value =
    transaction.description || "";


  dateInput.value =
    transaction.date;


  updateCategoryDropdown(
    transaction.categoryId
  );


  submitTransactionBtn.textContent =
    "Save Changes";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });


  setTimeout(
    () => {

      amountInput.focus();

    },
    400
  );
}


/* ================================
   DELETE TRANSACTION
================================ */

function deleteTransaction(id) {

  const transaction =
    transactions.find(
      (item) =>
        item.id === id
    );


  if (!transaction) return;


  const confirmed =
    confirm(
      "Delete this transaction?"
    );


  if (!confirmed) return;


  transactions =
    transactions.filter(
      (item) =>
        item.id !== id
    );


  saveTransactions();


  if (
    editingTransactionId === id
  ) {
    resetTransactionForm();
  }


  renderTransactions();

  updateDashboard();

  updateBudget();
}


/* ================================
   CLEAR TRANSACTIONS
================================ */

clearTransactionsBtn.addEventListener(
  "click",
  () => {

    if (
      transactions.length === 0
    ) {
      return;
    }


    const confirmed =
      confirm(
        "Delete all transactions? This cannot be undone."
      );


    if (!confirmed) return;


    transactions = [];


    saveTransactions();


    resetTransactionForm();

    renderTransactions();

    updateDashboard();

    updateBudget();
  }
);


/* ================================
   DASHBOARD
================================ */

function updateDashboard() {

  let totalIncome = 0;
  let totalExpenses = 0;

  let currentMonthIncome = 0;
  let currentMonthExpenses = 0;


  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();


  transactions.forEach(
    (transaction) => {

      const amount =
        Number(
          transaction.amount
        ) || 0;


      if (
        transaction.type ===
        "income"
      ) {

        totalIncome +=
          amount;

      } else {

        totalExpenses +=
          amount;
      }


      const transactionDate =
        parseLocalDate(
          transaction.date
        );


      if (
        transactionDate.getFullYear() ===
          currentYear &&
        transactionDate.getMonth() ===
          currentMonth
      ) {

        if (
          transaction.type ===
          "income"
        ) {

          currentMonthIncome +=
            amount;

        } else {

          currentMonthExpenses +=
            amount;
        }
      }
    }
  );


  const totalBalance =
    totalIncome -
    totalExpenses;


  const monthlyBalance =
    currentMonthIncome -
    currentMonthExpenses;


  balanceAmount.textContent =
    formatSignedBalance(
      totalBalance
    );


  incomeAmount.textContent =
    formatCurrency(
      totalIncome
    );


  expenseAmount.textContent =
    formatCurrency(
      totalExpenses
    );


  monthIncome.textContent =
    formatCurrency(
      currentMonthIncome
    );


  monthExpenses.textContent =
    formatCurrency(
      currentMonthExpenses
    );


  monthBalance.textContent =
    formatSignedBalance(
      monthlyBalance
    );


  monthBalance.style.color =
    monthlyBalance < 0
      ? "var(--expense)"
      : "var(--income)";
}


/* ================================
   MONTHLY BUDGET
================================ */

function updateBudget() {

  const now =
    new Date();

  const currentYear =
    now.getFullYear();

  const currentMonth =
    now.getMonth();


  let currentMonthExpenses = 0;


  transactions.forEach(
    (transaction) => {

      if (
        transaction.type !==
        "expense"
      ) {
        return;
      }


      const transactionDate =
        parseLocalDate(
          transaction.date
        );


      if (
        transactionDate.getFullYear() ===
          currentYear &&
        transactionDate.getMonth() ===
          currentMonth
      ) {

        currentMonthExpenses +=
          Number(
            transaction.amount
          ) || 0;
      }
    }
  );


  const remaining =
    monthlyBudget -
    currentMonthExpenses;


  const percentage =
    monthlyBudget > 0
      ? (
          currentMonthExpenses /
          monthlyBudget
        ) * 100
      : 0;


  const displayPercentage =
    Math.round(
      percentage
    );


  const progressPercentage =
    Math.min(
      percentage,
      100
    );


  if (budgetAmount) {

    budgetAmount.textContent =
      formatCurrency(
        monthlyBudget
      );
  }


  if (budgetRemaining) {

    budgetRemaining.textContent =
      formatSignedBalance(
        remaining
      );


    budgetRemaining.style.color =
      remaining < 0
        ? "var(--expense)"
        : "var(--income)";
  }


  if (budgetSpentText) {

    budgetSpentText.textContent =
      `${formatCurrency(
        currentMonthExpenses
      )} spent`;
  }


  if (budgetPercent) {

    budgetPercent.textContent =
      `${displayPercentage}%`;
  }


  if (budgetProgressBar) {

    budgetProgressBar.style.width =
      `${progressPercentage}%`;


    budgetProgressBar.style.background =
      remaining < 0
        ? "var(--expense)"
        : "var(--primary)";
  }


  if (monthlyBudgetInput) {

    monthlyBudgetInput.value =
      monthlyBudget || "";
  }
}


/* ================================
   SAVE BUDGET
================================ */

if (saveBudgetBtn) {

  saveBudgetBtn.addEventListener(
    "click",
    () => {

      const value =
        Number(
          monthlyBudgetInput.value
        );


      if (
        value < 0 ||
        Number.isNaN(value)
      ) {

        alert(
          "Please enter a valid budget."
        );

        return;
      }


      monthlyBudget =
        value;


      saveBudget();

      updateBudget();


      alert(
        "Monthly budget saved."
      );
    }
  );
}


/* ================================
   EDIT BUDGET
================================ */

if (editBudgetBtn) {

  editBudgetBtn.addEventListener(
    "click",
    () => {

      categoryModal
        .classList
        .remove("hidden");


      document.body.style.overflow =
        "hidden";


      setTimeout(
        () => {

          monthlyBudgetInput
            .scrollIntoView({
              behavior:
                "smooth",

              block:
                "center"
            });


          monthlyBudgetInput.focus();

        },
        200
      );
    }
  );
}


/* ================================
   SETTINGS MODAL
================================ */

settingsBtn.addEventListener(
  "click",
  () => {

    categoryModal
      .classList
      .remove("hidden");


    document.body.style.overflow =
      "hidden";


    updateCategoryManager();

    updateBudget();
  }
);


closeModalBtn.addEventListener(
  "click",
  closeSettings
);


modalOverlay.addEventListener(
  "click",
  closeSettings
);


function closeSettings() {

  categoryModal
    .classList
    .add("hidden");


  document.body.style.overflow =
    "";
}


/* ================================
   CATEGORY TABS
================================ */

categoryTabs.forEach(
  (tab) => {

    tab.addEventListener(
      "click",
      () => {

        selectedCategoryType =
          tab.dataset.categoryType;


        categoryTabs.forEach(
          (button) => {

            button.classList.toggle(
              "active",
              button === tab
            );

          }
        );


        updateCategoryManager();
      }
    );
  }
);


/* ================================
   ADD CATEGORY
================================ */

categoryForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    const name =
      categoryName.value.trim();


    const emoji =
      categoryEmoji.value.trim() ||
      "📌";


    if (!name) return;


    const duplicate =
      categories[
        selectedCategoryType
      ].some(
        (category) =>
          category.name
            .toLowerCase() ===
          name.toLowerCase()
      );


    if (duplicate) {

      alert(
        "This category already exists."
      );

      return;
    }


    categories[
      selectedCategoryType
    ].push({

      id: createId(),

      name,

      emoji
    });


    saveCategories();


    categoryForm.reset();


    updateCategoryManager();

    updateCategoryDropdown();

    renderTransactions();
  }
);


/* ================================
   CATEGORY MANAGER
================================ */

function updateCategoryManager() {

  categoryList.innerHTML =
    "";


  const categoryArray =
    categories[
      selectedCategoryType
    ] || [];


  if (
    categoryArray.length === 0
  ) {

    categoryList.innerHTML = `
      <div class="empty-state">
        <p>
          No categories yet.
        </p>
      </div>
    `;

    return;
  }


  categoryArray.forEach(
    (category) => {

      const item =
        document.createElement(
          "div"
        );


      item.className =
        "category-item";


      item.innerHTML = `

        <div class="category-item-emoji">
          ${escapeHTML(
            category.emoji ||
            "📌"
          )}
        </div>

        <div class="category-item-name">
          ${escapeHTML(
            category.name
          )}
        </div>

        <button
          class="delete-category-btn"
          data-id="${category.id}"
        >
          Delete
        </button>
      `;


      categoryList.appendChild(
        item
      );
    }
  );


  document
    .querySelectorAll(
      ".delete-category-btn"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            deleteCategory(
              button.dataset.id
            );

          }
        );
      }
    );
}


/* ================================
   DELETE CATEGORY
================================ */

function deleteCategory(id) {

  const category =
    categories[
      selectedCategoryType
    ].find(
      (item) =>
        item.id === id
    );


  if (!category) return;


  const used =
    transactions.some(
      (transaction) =>
        transaction.type ===
          selectedCategoryType &&
        transaction.categoryId ===
          id
    );


  let message =
    `Delete "${category.name}"?`;


  if (used) {

    message +=
      "\n\nExisting transactions will stay in your history, but this category will no longer be available for new transactions.";
  }


  const confirmed =
    confirm(message);


  if (!confirmed) return;


  categories[
    selectedCategoryType
  ] =
    categories[
      selectedCategoryType
    ].filter(
      (item) =>
        item.id !== id
    );


  saveCategories();


  updateCategoryManager();

  updateCategoryDropdown();

  renderTransactions();
}


/* ================================
   GET CATEGORY
================================ */

function getCategory(
  type,
  id
) {

  return (
    categories[type]?.find(
      (category) =>
        category.id === id
    ) || null
  );
}


/* ================================
   EXPORT BACKUP
================================ */

exportBtn.addEventListener(
  "click",
  () => {

    const backup = {

      app:
        "My Money",

      version:
        2,

      exportedAt:
        new Date()
          .toISOString(),

      transactions,

      categories,

      monthlyBudget
    };


    const data =
      JSON.stringify(
        backup,
        null,
        2
      );


    const blob =
      new Blob(
        [data],
        {
          type:
            "application/json"
        }
      );


    const url =
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    const today =
      new Date()
        .toISOString()
        .split("T")[0];


    link.href =
      url;


    link.download =
      `my-money-backup-${today}.json`;


    document.body.appendChild(
      link
    );


    link.click();


    document.body.removeChild(
      link
    );


    URL.revokeObjectURL(
      url
    );
  }
);


/* ================================
   IMPORT BACKUP
================================ */

importInput.addEventListener(
  "change",
  (event) => {

    const file =
      event.target.files[0];


    if (!file) return;


    const reader =
      new FileReader();


    reader.onload =
      (loadEvent) => {

        try {

          const backup =
            JSON.parse(
              loadEvent.target.result
            );


          if (
            !Array.isArray(
              backup.transactions
            ) ||
            !backup.categories ||
            !Array.isArray(
              backup.categories.expense
            ) ||
            !Array.isArray(
              backup.categories.income
            )
          ) {

            throw new Error(
              "Invalid backup"
            );
          }


          const confirmed =
            confirm(
              "Import this backup? Your current data will be replaced."
            );


          if (!confirmed) {

            importInput.value =
              "";

            return;
          }


          transactions =
            backup.transactions;


          categories =
            backup.categories;


          monthlyBudget =
            Number(
              backup.monthlyBudget
            ) || 0;


          saveTransactions();

          saveCategories();

          saveBudget();


          resetTransactionForm();

          updateCategoryManager();

          updateCategoryDropdown();

          renderTransactions();

          updateDashboard();

          updateBudget();


          alert(
            "Backup imported successfully."
          );


          closeSettings();

        } catch (error) {

          console.error(
            error
          );


          alert(
            "This file is not a valid My Money backup."
          );
        }


        importInput.value =
          "";
      };


    reader.readAsText(
      file
    );
  }
);


/* ================================
   HELPERS
================================ */

function createId() {

  if (
    window.crypto &&
    crypto.randomUUID
  ) {

    return crypto.randomUUID();
  }


  return (
    Date.now()
      .toString(36) +

    Math.random()
      .toString(36)
      .substring(2)
  );
}


function formatCurrency(amount) {

  return new Intl.NumberFormat(
    "en-CA",
    {
      style:
        "currency",

      currency:
        "CAD"
    }
  ).format(
    Number(amount) || 0
  );
}


function formatSignedBalance(amount) {

  const number =
    Number(amount) || 0;


  if (number < 0) {

    return `-${formatCurrency(
      Math.abs(number)
    )}`;
  }


  return formatCurrency(
    number
  );
}


function parseLocalDate(
  dateString
) {

  const parts =
    dateString.split("-");


  return new Date(
    Number(parts[0]),
    Number(parts[1]) - 1,
    Number(parts[2])
  );
}


function formatDate(
  dateString
) {

  const date =
    parseLocalDate(
      dateString
    );


  return date.toLocaleDateString(
    "en-CA",
    {
      month:
        "short",

      day:
        "numeric"
    }
  );
}


function escapeHTML(value) {

  const div =
    document.createElement(
      "div"
    );


  div.textContent =
    value == null
      ? ""
      : String(value);


  return div.innerHTML;
}
