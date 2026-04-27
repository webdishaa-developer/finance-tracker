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
