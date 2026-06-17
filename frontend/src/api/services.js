import api from './client';

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// Transactions
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  create: (data) => api.post('/transactions', data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Summary
export const summaryAPI = {
  monthly: (month, year) => api.get('/summary', { params: { month, year } }),
  yearly: (year) => api.get('/summary/yearly', { params: { year } }),
};

// CSV Export — converts transactions to downloadable CSV file
export const exportToCSV = (transactions, month, year) => {
  if (!transactions.length) return;

  const headers = ['Date', 'Type', 'Category', 'Service Type', 'Note', 'Amount'];

  const rows = transactions.map((txn) => [
    new Date(txn.date).toLocaleDateString('en-IN'),
    txn.type,
    txn.category,
    txn.serviceType || '',
    txn.note || '',
    txn.amount,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fintrack-${month}-${year}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};