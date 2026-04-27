import React from 'react';
import { formatCurrency } from '../utils/helpers';

const SummaryCards = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="summary-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="summary-card skeleton" />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Income',
      value: summary?.income?.total || 0,
      count: summary?.income?.count || 0,
      colorClass: 'card-income',
      icon: '↑',
    },
    {
      label: 'Total Expenses',
      value: summary?.expense?.total || 0,
      count: summary?.expense?.count || 0,
      colorClass: 'card-expense',
      icon: '↓',
    },
    {
      label: 'Profit / Loss',
      value: summary?.profitLoss || 0,
      count: (summary?.income?.count || 0) + (summary?.expense?.count || 0),
      colorClass: (summary?.profitLoss || 0) >= 0 ? 'card-profit' : 'card-loss',
      icon: (summary?.profitLoss || 0) >= 0 ? '✓' : '!',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div key={card.label} className={`summary-card ${card.colorClass}`}>
          <div className="card-header">
            <span className="card-label">{card.label}</span>
            <span className="card-icon">{card.icon}</span>
          </div>
          <div className="card-value">{formatCurrency(card.value)}</div>
          <div className="card-meta">{card.count} transaction{card.count !== 1 ? 's' : ''}</div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
