export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};

export const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

export const INCOME_CATEGORIES = [
  'Sales', 'Service', 'Consulting', 'Investment', 'Freelance', 'Refund', 'Other'
];

export const EXPENSE_CATEGORIES = [
  'Salaries', 'Rent', 'Utilities', 'Marketing', 'Software', 'Travel',
  'Office Supplies', 'Equipment', 'Taxes', 'Insurance', 'Maintenance', 'Other'
];

export const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
};

export const getYearRange = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => current - i);
};
