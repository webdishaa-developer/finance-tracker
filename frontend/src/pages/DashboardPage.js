import React, { useState, useEffect, useCallback } from 'react';
import { transactionAPI, summaryAPI } from '../api/services';
import { getCurrentMonthYear } from '../utils/helpers';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import MonthlyChart from '../components/MonthlyChart';
import AddTransactionModal from '../components/AddTransactionModal';

const DashboardPage = () => {
  const { month: initMonth, year: initYear } = getCurrentMonthYear();
  const [month, setMonth] = useState(initMonth);
  const [year, setYear] = useState(initYear);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [txnLoading, setTxnLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setTxnLoading(true);
    try {
      const { data } = await transactionAPI.getAll({ month, year, limit: 100 });
      setTransactions(data.transactions);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setTxnLoading(false);
    }
  }, [month, year]);

  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const { data } = await summaryAPI.monthly(month, year);
      setSummary(data);
    } catch (err) {
      console.error('Failed to fetch summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const handleRefresh = () => {
    fetchTransactions();
    fetchSummary();
  };

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <FilterBar
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
          onAddClick={() => setShowModal(true)}
        />

        <SummaryCards summary={summary} loading={summaryLoading} />

        <MonthlyChart year={year} />

        <TransactionList
          transactions={transactions}
          loading={txnLoading}
          onDeleted={handleRefresh}
        />
      </main>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
};

export default DashboardPage;
