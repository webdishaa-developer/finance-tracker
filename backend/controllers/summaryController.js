const Transaction = require('../models/Transaction');

// @route GET /api/summary?month=&year=
const getMonthlySummary = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'month and year are required' });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const income = result.find((r) => r._id === 'income') || { total: 0, count: 0 };
    const expense = result.find((r) => r._id === 'expense') || { total: 0, count: 0 };

    // Category breakdown
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json({
      month: Number(month),
      year: Number(year),
      income: { total: income.total, count: income.count },
      expense: { total: expense.total, count: expense.count },
      profitLoss: income.total - expense.total,
      categoryBreakdown
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route GET /api/summary/yearly?year=
const getYearlySummary = async (req, res) => {
  try {
    const { year } = req.query;
    if (!year) return res.status(400).json({ message: 'year is required' });

    const start = new Date(year, 0, 1);
    const end = new Date(Number(year) + 1, 0, 1);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lt: end }
        }
      },
      {
        $group: {
          _id: { month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.month': 1 } }
    ]);

    // Build 12-month array
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthData = { month: i + 1, income: 0, expense: 0, profitLoss: 0 };
      result.forEach((r) => {
        if (r._id.month === i + 1) {
          monthData[r._id.type] = r.total;
        }
      });
      monthData.profitLoss = monthData.income - monthData.expense;
      return monthData;
    });

    const totals = months.reduce(
      (acc, m) => ({
        income: acc.income + m.income,
        expense: acc.expense + m.expense,
        profitLoss: acc.profitLoss + m.profitLoss
      }),
      { income: 0, expense: 0, profitLoss: 0 }
    );

    res.json({ year: Number(year), months, totals });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMonthlySummary, getYearlySummary };
