import React, { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts';

const COLORS = [
  '#10b981', '#6366f1', '#f43f5e', '#f59e0b',
  '#3b82f6', '#ec4899', '#14b8a6', '#8b5cf6',
  '#ef4444', '#06b6d4',
];

const formatK = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value}`;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 8,
        padding: '8px 12px',
        color: '#f1f5f9',
        fontSize: 13,
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>{name}</p>
        <p style={{ margin: 0, color: '#94a3b8' }}>₹{value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const CategoryChart = ({ summary }) => {
  const [activeType, setActiveType] = useState('expense');

  const categories = summary?.[activeType]?.categories || {};

  const data = Object.entries(categories)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  if (!data.length) {
    return (
      <div className="chart-section">
        <div className="section-header">
          <h3 className="section-title">Category Breakdown</h3>
          <div className="type-toggle" style={{ gap: 8 }}>
            <button
              className={`toggle-btn ${activeType === 'expense' ? 'active-expense' : ''}`}
              onClick={() => setActiveType('expense')}
            >
              Expenses
            </button>
            <button
              className={`toggle-btn ${activeType === 'income' ? 'active-income' : ''}`}
              onClick={() => setActiveType('income')}
            >
              Income
            </button>
          </div>
        </div>
        <div className="empty-state">
          <span className="empty-icon">🥧</span>
          <p>No {activeType} data for this period.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-section">
      <div className="section-header">
        <h3 className="section-title">Category Breakdown</h3>
        <div className="type-toggle" style={{ gap: 8 }}>
          <button
            className={`toggle-btn ${activeType === 'expense' ? 'active-expense' : ''}`}
            onClick={() => setActiveType('expense')}
          >
            Expenses
          </button>
          <button
            className={`toggle-btn ${activeType === 'income' ? 'active-income' : ''}`}
            onClick={() => setActiveType('income')}
          >
            Income
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value, entry) => (
                <span style={{ color: '#94a3b8', fontSize: 12 }}>
                  {value} — {formatK(entry.payload.value)}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;