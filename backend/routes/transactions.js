const express = require('express');
const router = express.Router();
const { getTransactions, createTransaction, deleteTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect); // all routes protected

router.get('/', getTransactions);
router.post('/', createTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
