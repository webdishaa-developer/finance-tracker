import React, { useState } from 'react';
import { transactionAPI } from '../api/services';
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '../utils/helpers';

const defaultForm = {
  type: 'income',
  amount: '',
  category: '',
  serviceType: '',
  note: '',
  date: new Date().toISOString().split('T')[0],
};

const AddTransactionModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.amount || Number(form.amount) <= 0) {
      return setError('Enter a valid amount');
    }
    setLoading(true);
    try {
      await transactionAPI.create({
        ...form,
        amount: Number(form.amount),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Transaction</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="type-toggle">
            <button
              type="button"
              className={`toggle-btn ${form.type === 'income' ? 'active-income' : ''}`}
              onClick={() => setForm({ ...form, type: 'income', category: '' })}
            >
              ↑ Income
            </button>
            <button
              type="button"
              className={`toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => setForm({ ...form, type: 'expense', category: '' })}
            >
              ↓ Expense
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Service Type</label>
              <input
                type="text"
                name="serviceType"
                value={form.serviceType}
                onChange={handleChange}
                placeholder="e.g. Web Design"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Optional description"
              maxLength={200}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`btn ${form.type === 'income' ? 'btn-income' : 'btn-expense'}`}
              disabled={loading}
            >
              {loading ? 'Saving…' : `Add ${form.type === 'income' ? 'Income' : 'Expense'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
