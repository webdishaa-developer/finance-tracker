const Transaction = require('../models/Transaction');

// @route GET /api/transactions
const getTransactions = async (req, res) => {
  try {
    const { month, year, type, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user._id };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      filter.date = { $gte: start, $lt: end };
    } else if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(Number(year) + 1, 0, 1);
      filter.date = { $gte: start, $lt: end };
    }

    if (type && ['income', 'expense'].includes(type)) {
      filter.type = type;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [transactions, total] = await Promise.all([
      Transaction.find(filter)
        .sort({ date: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Transaction.countDocuments(filter)
    ]);

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/transactions
const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, serviceType, note, date } = req.body;

    if (!type || !amount || !category) {
      return res.status(400).json({ message: 'type, amount, and category are required' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      serviceType: serviceType || '',
      note: note || '',
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({ transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @route DELETE /api/transactions/:id
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id  // ensures user owns this transaction
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTransactions, createTransaction, deleteTransaction };
