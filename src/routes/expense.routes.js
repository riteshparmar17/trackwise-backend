const express = require('express');
const auth = require('../middleware/auth.middleware');
const {
    createExpense,
    getExpenses,
    getFilteredExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    deleteReceipt
} = require('../controllers/expense.controller');
const router = express.Router();
const upload = require('../config/multer.config');

router.post('/createExpense', auth(), upload.single('receipt'), createExpense);
router.get('/getExpenses', auth(), getExpenses);
router.get('/getFilteredExpenses', auth(), getFilteredExpenses);
router.get('/getExpenseById/:id', auth(), getExpenseById);
router.put('/updateExpense/:id', auth(), upload.single('receipt'), updateExpense);
router.delete('/deleteExpense/:id', auth(), deleteExpense);
router.post('/uploadReceipt/:id', auth(), upload.single('receipt'), uploadReceipt);
router.delete('/deleteReceipt/:id', auth(), deleteReceipt);

module.exports = router;