import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { summaryAPI } from '../api/services';
import { MONTHS } from '../utils/helpers';

const formatK = (value) => {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
};

const MonthlyChart = ({ year }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    summaryAPI.yearly(year)
      .then(({ data }) => {
        const chartData = data.months.map((m) => ({
          name: MONTHS[m.month - 1].slice(0, 3),
          Income: m.income,
          Expense: m.expense,
          'Profit/Loss': m.profitLoss,
        }));
        setData(chartData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  if (loading) return <div className="chart-skeleton skeleton" />;

  return (
    <div className="chart-section">
      <h3 className="section-title">Monthly Overview — {year}</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={formatK} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(val) => `₹${val.toLocaleString('en-IN')}`}
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
            />
            <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Profit/Loss" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyChart;
