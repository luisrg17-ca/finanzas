* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --bg: #f5f5f7;
  --card: #ffffff;
  --text: #1d1d1f;
  --muted: #6e6e73;
  --border: #e5e5ea;
  --primary: #111111;
  --income: #16803c;
  --expense: #d92d20;
  --expense-bg: #fff0ee;
  --warning: #b56a00;
  --shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  --radius: 20px;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Helvetica,
    Arial,
    sans-serif;

  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
  -webkit-tap-highlight-color: transparent;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

/* HEADER */

.topbar {
  max-width: 680px;
  margin: 0 auto;
  padding:
    calc(20px + env(safe-area-inset-top))
    18px
    14px;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.welcome {
  font-size: 13px;
  color: var(--muted);
  margin-bottom: 2px;
}

.topbar h1 {
  font-size: 26px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: white;
  font-size: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* MAIN */

.container {
  width: min(100%, 680px);
  margin: 0 auto;
  padding: 0 14px 40px;
}

/* CARDS */

.card,
.balance-card,
.account-card {
  background: var(--card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.card,
.balance-card,
.accounts-grid {
  margin-bottom: 14px;
}

/* NET BALANCE */

.balance-card {
  padding: 22px;
  background: #171717;
  color: white;
}

.balance-label {
  font-size: 13px;
  opacity: 0.65;
  margin-bottom: 6px;
}

.balance-card > h2 {
  font-size: 36px;
  letter-spacing: -1px;
  margin-bottom: 20px;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.08);
}

.summary-item p {
  font-size: 12px;
  opacity: 0.7;
}

.summary-item strong {
  display: block;
  margin-top: 2px;
  font-size: 15px;
}

.summary-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ACCOUNT CARDS */

.accounts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.account-card {
  padding: 17px;
}

.account-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 18px;
}

.account-card-header h2 {
  font-size: 18px;
}

.account-icon {
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #f3f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 19px;
}

.account-main-value span,
.credit-account-grid span,
.credit-limit-row,
.credit-progress-footer {
  color: var(--muted);
  font-size: 11px;
}

.account-main-value strong {
  display: block;
  margin-top: 5px;
  font-size: 24px;
  letter-spacing: -0.5px;
}

.credit-account-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.credit-account-grid strong {
  display: block;
  margin-top: 4px;
  font-size: 16px;
}

.credit-debt {
  color: var(--expense);
}

.credit-limit-row,
.credit-progress-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.credit-limit-row {
  margin-top: 14px;
}

.credit-progress {
  width: 100%;
  height: 8px;
  margin-top: 7px;
  background: #eeeeef;
  border-radius: 999px;
  overflow: hidden;
}

.credit-progress-bar {
  width: 0%;
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
  transition: width 0.25s ease, background 0.25s ease;
}

.credit-progress-footer {
  margin-top: 6px;
}

/* STANDARD CARD */

.card {
  padding: 18px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-small {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--muted);
  margin-bottom: 2px;
}

.section-header h2 {
  font-size: 19px;
  letter-spacing: -0.3px;
}

/* TYPE SWITCHES */

.type-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 4px;
  background: #f1f1f3;
  border-radius: 14px;
  margin-bottom: 16px;
}

.type-switch.three-options {
  grid-template-columns: repeat(3, 1fr);
}

.type-btn,
.payment-method-btn,
.category-tab {
  border: none;
  background: transparent;
  color: var(--muted);
  font-weight: 700;
}

.type-btn {
  min-height: 42px;
  padding: 8px 6px;
  border-radius: 11px;
  font-size: 13px;
}

.type-btn.active,
.payment-method-btn.active,
.category-tab.active {
  background: white;
  color: var(--text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.payment-method-switch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 13px;
  background: #f1f1f3;
}

.payment-method-btn {
  min-height: 42px;
  border-radius: 10px;
  font-size: 14px;
}

/* FORMS */

.amount-input-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0 18px;
}

.amount-input-wrapper span {
  font-size: 25px;
  font-weight: 700;
  margin-right: 4px;
}

.amount-input-wrapper input {
  width: 170px;
  border: none;
  outline: none;
  font-size: 38px;
  font-weight: 750;
  text-align: left;
  background: transparent;
  color: var(--text);
  padding: 0;
  min-height: unset;
}

.amount-input-wrapper input::placeholder {
  color: #c7c7cc;
}

.form-group {
  margin-bottom: 13px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 650;
}

input,
select {
  width: 100%;
  min-height: 46px;
  padding: 0 13px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #fafafa;
  color: var(--text);
  font-size: 16px;
  outline: none;
}

input:focus,
select:focus {
  border-color: #a1a1a6;
  background: white;
}

input::placeholder {
  color: #aaaab0;
}

.payment-info {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 13px;
  border-radius: 13px;
  background: #f7f7f8;
  margin-bottom: 13px;
}

.payment-info-icon {
  font-size: 20px;
}

.payment-info strong {
  font-size: 13px;
}

.payment-info p {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.4;
}

.hidden {
  display: none !important;
}

/* BUTTONS */

.primary-btn {
  width: 100%;
  min-height: 49px;
  margin-top: 4px;
  border: none;
  border-radius: 14px;
  background: var(--primary);
  color: white;
  font-size: 15px;
  font-weight: 750;
}

.secondary-btn {
  min-height: 42px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: white;
  color: var(--text);
  font-size: 12px;
  font-weight: 700;

  display: flex;
  align-items: center;
  justify-content: center;
}

.full-width-btn {
  width: 100%;
}

.text-btn {
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
}

.primary-btn:active,
.secondary-btn:active,
.icon-btn:active,
.type-btn:active,
.payment-method-btn:active,
.category-tab:active,
.add-category-btn:active {
  transform: scale(0.98);
}

/* MONTH SUMMARY */

#monthLabel {
  font-size: 12px;
  color: var(--muted);
}

.month-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.month-stats > div {
  padding: 12px 9px;
  border-radius: 13px;
  background: #f7f7f8;
}

.month-stats span {
  display: block;
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 11px;
}

.month-stats strong {
  font-size: 14px;
}

/* BUDGET */

.budget-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.budget-top > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.budget-remaining {
  text-align: right;
}

.budget-label {
  font-size: 11px;
  color: var(--muted);
}

#budgetAmount,
#budgetRemaining {
  font-size: 18px;
  font-weight: 750;
}

.budget-progress {
  width: 100%;
  height: 10px;
  background: #eeeeef;
  border-radius: 999px;
  overflow: hidden;
}

.budget-progress-bar {
  width: 0%;
  height: 100%;
  background: var(--primary);
  border-radius: 999px;
  transition: width 0.3s ease, background 0.3s ease;
}

.budget-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  color: var(--muted);
  font-size: 11px;
}

/* FILTERS */

.history-filters {
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
}

.history-filters > input,
.history-filters > select {
  margin-bottom: 8px;
}

.filter-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;
}

.filter-row select,
.filter-row input {
  min-width: 0;
  font-size: 14px;
}

.clear-filters-btn {
  width: 100%;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  padding: 5px;
}

/* TRANSACTIONS */

.transaction-list {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 0;
  border-bottom: 1px solid var(--border);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-icon {
  width: 40px;
  height: 40px;
  border-radius: 13px;
  background: #f4f4f5;
  font-size: 19px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.transaction-info {
  flex: 1;
  min-width: 0;
}

.transaction-info h3 {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.transaction-info p {
  margin-top: 3px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.35;
}

.transaction-method {
  display: inline-block;
  margin-top: 4px;
  padding: 3px 6px;
  border-radius: 999px;
  background: #f2f2f4;
  color: var(--muted);
  font-size: 9px;
  font-weight: 700;
}

.transaction-amount {
  font-size: 13px;
  font-weight: 750;
  white-space: nowrap;
}

.transaction-amount.income {
  color: var(--income);
}

.transaction-amount.expense {
  color: var(--expense);
}

.transaction-amount.payment {
  color: var(--warning);
}

.transaction-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.small-action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 13px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.small-action-btn:active {
  background: #f1f1f3;
}

/* EMPTY STATE */

.empty-state {
  text-align: center;
  padding: 28px 12px 22px;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.empty-state h3 {
  font-size: 15px;
  margin-bottom: 4px;
}

.empty-state p {
  color: var(--muted);
  font-size: 12px;
}

/* MODAL */

.modal {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.modal-content {
  position: relative;
  z-index: 2;
  width: min(100%, 680px);
  max-height: 88vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: white;
  border-radius: 24px 24px 0 0;
  padding: 20px 18px calc(24px + env(safe-area-inset-bottom));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.modal-header h2 {
  font-size: 20px;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: #f2f2f4;
  font-size: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
}

/* SETTINGS */

.settings-section {
  padding: 18px 0;
  border-top: 1px solid var(--border);
}

.settings-section:first-of-type {
  border-top: none;
}

.settings-section h3 {
  margin-bottom: 5px;
  font-size: 15px;
}

.settings-description {
  margin-bottom: 13px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.45;
}

.money-input-wrapper {
  display: flex;
  align-items: center;
  min-height: 46px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #fafafa;
  overflow: hidden;
}

.money-input-wrapper span {
  padding-left: 13px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 700;
}

.money-input-wrapper input {
  border: none;
  border-radius: 0;
  background: transparent;
  padding-left: 6px;
}

.money-input-wrapper:focus-within {
  border-color: #a1a1a6;
  background: white;
}

/* CATEGORY MANAGEMENT */

.category-type-selector {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  margin-bottom: 14px;
  background: #f1f1f3;
  border-radius: 13px;
}

.category-tab {
  min-height: 40px;
  border-radius: 10px;
}

.category-form-row {
  display: grid;
  grid-template-columns: 58px 1fr 46px;
  gap: 7px;
  margin-bottom: 14px;
}

.emoji-input {
  text-align: center;
  padding: 0;
}

.add-category-btn {
  border: none;
  border-radius: 13px;
  background: var(--primary);
  color: white;
  font-size: 23px;
  font-weight: 600;
}

.category-list {
  display: flex;
  flex-direction: column;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 2px;
  border-bottom: 1px solid var(--border);
}

.category-item-emoji {
  width: 35px;
  text-align: center;
  font-size: 20px;
}

.category-item-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
}

.delete-category-btn {
  border: none;
  border-radius: 10px;
  background: var(--expense-bg);
  color: var(--expense);
  padding: 7px 10px;
  font-size: 11px;
  font-weight: 600;
}

.budget-input-row,
.backup-buttons {
  display: grid;
  grid-template-columns: 1fr 90px;
  gap: 8px;
}

.backup-buttons {
  grid-template-columns: 1fr 1fr;
}

.upload-btn {
  text-align: center;
}

/* MOBILE */

@media (max-width: 560px) {
  .accounts-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .topbar {
    padding-left: 14px;
    padding-right: 14px;
  }

  .container {
    padding-left: 10px;
    padding-right: 10px;
  }

  .balance-card {
    padding: 19px;
  }

  .balance-card > h2 {
    font-size: 32px;
  }

  .card {
    padding: 15px;
  }

  .amount-input-wrapper input {
    width: 150px;
    font-size: 34px;
  }

  .type-btn {
    font-size: 11px;
  }

  .month-stats {
    gap: 5px;
  }

  .month-stats > div {
    padding: 10px 7px;
  }

  .month-stats strong {
    font-size: 13px;
  }

  .transaction-item {
    gap: 7px;
  }

  .transaction-icon {
    width: 37px;
    height: 37px;
    font-size: 17px;
  }

  .transaction-info h3 {
    font-size: 13px;
  }

  .transaction-amount {
    font-size: 12px;
  }

  .small-action-btn {
    width: 26px;
    height: 26px;
    font-size: 12px;
  }

  .filter-row {
    gap: 6px;
  }

  .filter-row select,
  .filter-row input {
    padding-left: 9px;
    padding-right: 9px;
    font-size: 13px;
  }
}

@media (max-width: 370px) {
  .summary-grid,
  .month-stats,
  .filter-row,
  .budget-input-row,
  .backup-buttons {
    grid-template-columns: 1fr;
  }

  .transaction-actions {
    flex-direction: column;
  }
}

/* NUMBER INPUT */

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}


/* MONTH COMPARISON */

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.comparison-box {
  padding: 13px;
  border-radius: 13px;
  background: #f7f7f8;
}

.comparison-box span {
  display: block;
  margin-bottom: 5px;
  color: var(--muted);
  font-size: 11px;
}

.comparison-box strong {
  font-size: 17px;
}

.comparison-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px;
  border-radius: 13px;
  background: #f7f7f8;
}

.comparison-result-label {
  display: block;
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 11px;
}

.comparison-result strong {
  font-size: 17px;
}

.comparison-percent-wrap {
  min-width: 62px;
  padding: 7px 9px;
  border-radius: 999px;
  background: #eeeeef;
  text-align: center;
  font-size: 12px;
  font-weight: 750;
}

.comparison-result.better strong,
.comparison-result.better .comparison-percent-wrap {
  color: var(--income);
}

.comparison-result.worse strong,
.comparison-result.worse .comparison-percent-wrap {
  color: var(--expense);
}

.comparison-result.neutral strong,
.comparison-result.neutral .comparison-percent-wrap {
  color: var(--text);
}

.comparison-message {
  margin-top: 9px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.45;
}

/* DANGER ZONE */

.danger-zone {
  border-top-color: #f1c5c1;
}

.danger-zone h3 {
  color: var(--expense);
}

.danger-btn {
  width: 100%;
  min-height: 44px;
  border: 1px solid #f0c2bd;
  border-radius: 12px;
  background: var(--expense-bg);
  color: var(--expense);
  font-size: 13px;
  font-weight: 750;
}

.danger-btn:active {
  transform: scale(0.98);
}

@media (max-width: 370px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}
