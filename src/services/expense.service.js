const Expense = require('../models/expense.model');
const mongoose = require('mongoose');
const cloudnary = require('../config/cloudinary');
const streamifier = require('streamifier');

const EXPENSE_CATEGORIES = [
    'Fuel',
    'Maintenance',
    'Insurance',
    'Parking',
    'Toll',
    'Registration',
    'Cleaning',
    'Other'
];

const createExpense = async (userId, data, file) => {
    const {
        date,
        category,
        vendor,
        totalAmount,
        taxAmount,
        notes
    } = data;

    let receiptUploaded = true;
    let receipt = {
        publicId: '',
        url: '',
        originalFileName: ''
    };

    if (!date) {
        throw new Error('Date is required');
    }
    if (!category) {
        throw new Error('Expense category is required');
    }
    if (!EXPENSE_CATEGORIES.includes(category)) {
        throw new Error('Invalid expense category');
    }
    if (!vendor || !vendor.trim()) {
        throw new Error('Vendor is required');
    }

    if (totalAmount === undefined || totalAmount === null || Number(totalAmount) <= 0) {
        throw new Error('Total amount must be greater than zero');
    }

    const total = Number(totalAmount);
    const preTaxAmount = Number(total / 1.13).toFixed(2);
    const tax = Number(total - preTaxAmount).toFixed(2);

    if (file) {
        try {
            const uploadResult = await uploadToCloudinary(file);
            receipt = {
                publicId: uploadResult.public_id,
                url: uploadResult.secure_url,
                originalFileName: file.originalName
            };

        } catch (error) {
            receiptUploaded = false;
            console.error(`Receipt upload failed for user $(userId)`, error.message);
        }
    }

    const expense = await Expense.create({
        user: userId,
        date,
        category,
        vendor,
        totalAmount: total,
        taxAmount: tax,
        preTaxAmount,
        notes: notes || '',
        receipt
    });

    return {
        expense,
        receiptUploaded
    };
};

const uploadToCloudinary = async (file) => {
    if (!file) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const uploadStream = cloudnary.uploader.upload_stream(
            {
                folder: 'trackwise/expenseReceipts'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );

        streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);
    });
};

const getExpenses = async (userId) => {
    return await Expense.find({
        user: userId
    }).sort({
        date: -1,
        createdAt: -1
    });
};

const getFilteredExpenses = async (userId, filters) => {
    const {
        from,
        to,
        category,
        page = 1,
        limit = 10,
        sortBy = 'date',
        sortOrder = 'desc'
    } = filters;

    const filter = {
        user: new mongoose.Types.ObjectId(userId)
    };

    if (from && to) {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
            throw new Error('Invalid date format');
        }
        if (fromDate > toDate) {
            throw new Error('From date cannot be greater than To date');
        }

        fromDate.setHours(0, 0, 0, 0);
        toDate.setDate(toDate.getDate() + 1);

        filter.date = {
            $gte: fromDate,
            $lte: toDate
        };
    }

    if (category) {
        filter.category = category;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const [items, total, summary] = await Promise.all([
        Expense.find(filter)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit)),
        Expense.countDocuments(filter),
        Expense.aggregate([
            {
                $match: filter
            },
            {
                $group: {
                    _id: null,
                    totalAmount: {
                        $sum: '$totalAmount'
                    },
                    totalTax: {
                        $sum: '$taxAmount'
                    }
                }
            }
        ])
    ]);

    const summaryResult = {
        totalAmount: Number((summary[0]?.totalAmount || 0).toFixed(2)),
        totalTax: Number((summary[0]?.totalTax || 0).toFixed(2))
    };

    return {
        items,
        summary: summaryResult,
        meta: {
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit)
        }
    };
};

const getExpenseById = async (expenseId, userId) => {
    const expense = await Expense.findOne({
        _id: expenseId,
        user: userId
    });
    if (!expense) {
        throw new Error('Expense not found');
    }
    return expense;
};

const updateExpense = async (expenseId, userId, data, file) => {
    let receiptUploaded = true;
    const expense = await getExpenseById(expenseId, userId);
    if (!data.date) {
        throw new Error('Date is required');
    }
    if (!data.category) {
        throw new Error('Expense category is required');
    }
    if (!EXPENSE_CATEGORIES.includes(data.category)) {
        throw new Error('Invalid expense category');
    }
    if (!data.vendor?.trim()) {
        throw new Error('Vendor is required');
    }

    const total = Number(data.totalAmount);
    const preTaxAmount = Number(total / 1.13).toFixed(2);
    const tax = Number(total - preTaxAmount).toFixed(2);

    expense.date = data.date;
    expense.category = data.category;
    expense.vendor = data.vendor.trim();
    expense.totalAmount = total;
    expense.taxAmount = tax;
    expense.preTaxAmount = preTaxAmount;
    expense.notes = data.notes || '';

    if (file) {
        try {
            if (expense.receipt?.publicId) {
                await cloudnary.uploader.destroy(expense.receipt.publicId);
            }

            const uploadResult = await uploadToCloudinary(file);

            expense.receipt = {
                publicId: uploadResult.public_id,
                url: uploadResult.secure_url,
                originalFileName: file.originalName
            };
        } catch (error) {
            receiptUploaded = false;
            console.error(`Receipt upload failed while updateing expense $(expense._id)`, error.message);
        }
    }

    await expense.save();
    return {
        expense,
        receiptUploaded
    }
};

const deleteExpense = async (expenseId, userId) => {
    const expense = await Expense.findOneAndDelete({
        _id: expenseId,
        user: userId
    });

    if (!expense) {
        throw new Error('Expense not found')
    }

    return expense;
};

const uploadReceipt = async (expenseId, userId, file) => {
    const expense = await getExpenseById(expenseId, userId);
    if (!file) {
        throw new Error('Receipt file is required');
    }
    if (expense.receipt?.publicId) {
        await cloudnary.uploader.destroy(expense.receipt.publicId);
    }

    const result = await new Promise((resolve, reject) => {
        const uploadStream =
            cloudnary.uploader.upload_stream(
                {
                    folder: 'trackwise/expenseReceipts'
                },
                (error, result) => {
                    if (error) {
                        reject
                    } else {
                        resolve(result);
                    }
                }
            );
        streamifier
            .createReadStream(file.buffer)
            .pipe(uploadStream);
    });

    expense.receipt = {
        publicId: result.public_id,
        url: result.secure_url,
        originalName: file.originalName
    };

    return await expense.save();
};

const deleteReceipt = async (expenseId, userId) => {
    const expense = await getExpenseById(expenseId, userId);
    if (!expense.receipt?.publicId) {
        throw new Error('Receipt not found');
    }

    await cloudnary.uploader.destroy(expense.receipt.publicId);
    expense.receipt = {
        publicId: '',
        url: '',
        originalName: ''
    };

    return await expense.save();
};

module.exports = {
    createExpense,
    getExpenseById,
    getExpenses,
    getFilteredExpenses,
    updateExpense,
    deleteExpense,
    uploadReceipt,
    deleteReceipt
};