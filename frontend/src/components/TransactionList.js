import React, { useState } from 'react';
import { transactionAPI } from '../api/services';
import { formatCurrency, formatDate } from '../utils/helpers';

const TransactionList = ({ transactions, loading, onDeleted }) => {
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    setDeletingId(id);
    try {
      await transactionAPI.delete(id);
      onDeleted();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="transactions-section">
        <h3 className="section-title">Transactions</h3>
        <div className="skeleton-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton skeleton-row" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="transactions-section">
        <h3 className="section-title">Transactions</h3>
        <div className="empty-state">
          <span className="empty-icon">📊</span>
          <p>No transactions found for this period.</p>
          <p className="empty-sub">Click "Add Transaction" to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-section">
      <h3 className="section-title">
        Transactions <span className="count-badge">{transactions.length}</span>
      </h3>
      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Service</th>
              <th>Note</th>
              <th>Amount</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className={`txn-row txn-${txn.type}`}>
                <td className="txn-date">{formatDate(txn.date)}</td>
                <td>
                  <span className={`badge badge-${txn.type}`}>
                    {txn.type === 'income' ? '↑' : '↓'} {txn.type}
                  </span>
                </td>
                <td className="txn-category">{txn.category}</td>
                <td className="txn-service">{txn.serviceType || '—'}</td>
                <td className="txn-note">{txn.note || '—'}</td>
                <td className={`txn-amount amount-${txn.type}`}>
                  {txn.type === 'expense' ? '−' : '+'}{formatCurrency(txn.amount)}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(txn._id)}
                    disabled={deletingId === txn._id}
                    title="Delete"
                  >
                    {deletingId === txn._id ? '…' : '✕'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
