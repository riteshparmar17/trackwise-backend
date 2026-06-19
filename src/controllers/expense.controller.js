const expenseService = require('../services/expense.service');

const createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.user.id, req.body, req.file);
        res.status(201).json({
            success: true,
            receiptUploaded: expense.receiptUploaded,
            message: expense.receiptUploaded
                ? ' Expense created successfully'
                : 'Expense created. Receipt upload failed',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getExpenses = async (req, res) => {
    try {
        const expense = await expenseService.getExpenses(req.user.id);
        res.status(200).json({
            success: true,
            message: ' Expense retrieved successfully',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getFilteredExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getFilteredExpenses(req.user.id, req.query);
        res.status(200).json({
            success: true,
            data: expenses
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getExpenseById = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Expense retrived successfully',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.user.id, req.body, req.file);
        res.status(200).json({
            success: true,
            receiptUploaded: expense.receiptUploaded,
            message: expense.receiptUploaded
                ? 'Expense updated successfully'
                : 'Expense updated. Receipt upload failed.',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const expense = await expenseService.deleteExpense(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const uploadReceipt = async (req, res) => {
    try {
        const expense = await expenseService.uploadReceipt(req.params.id, req.user.id, req.file);
        res.status(200).json({
            success: true,
            message: 'Receipt uploaded successfully',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteReceipt = async (req, res) => {
    try {
        const expense = await expenseService.deleteReceipt(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Receipt deleted successfully',
            data: expense
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createExpense,
    getExpenses,
    getFilteredExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    deleteReceipt
};