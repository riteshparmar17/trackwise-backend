const mongoose = require('mongoose');
const Drive = require('../models/drive.model');
const Expense = require('../models/expense.model');

const buildDateFilter = (fromDate, toDate) => {
    if (fromDate && toDate) {
        return {
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        };
    }
    return {};
};

const getDashboardReport = async (userId, fromDate, toDate) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    let dateFilter;
    if (fromDate && toDate) {
        dateFilter = {
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        };
    }

    const driveStatsPromise = Drive.aggregate([
        {
            $match: {
                user: userObjectId,
                ...dateFilter
            }
        },
        {
            $group: {
                _id: null,
                totalDrives: { $sum: 1 },
                totalKms: { $sum: '$totalKM' },
                incompleteDrives: {
                    $sum: {
                        $cond: [
                            {
                                $or: [
                                    { $eq: ['$endKM', null] },
                                    { $not: ['$endKM'] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ]);

    const expenseStatsPromise = Expense.aggregate([
        {
            $match: {
                user: userObjectId,
                ...dateFilter
            }
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: '$totalAmount' },
                totalHst: { $sum: '$taxAmount' }
            }
        }
    ]);

    const kmsByMonthPromise = Drive.aggregate([
        {
            $match: {
                user: userObjectId,
                ...dateFilter
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' }
                },
                trips: { $sum: 1 },
                totalKms: { $sum: '$totalKM' }
            }
        },
        {
            $sort: {
                '_id.year': 1,
                '_id.month': 1
            }
        }
    ]);

    const expenseByCategoryPromise = Expense.aggregate([
        {
            $match: {
                user: userObjectId,
                ...dateFilter
            }
        },
        {
            $group: {
                _id: '$category',
                count: { $sum: 1 },
                hst: { $sum: '$taxAmount' },
                total: { $sum: '$totalAmount' }
            }
        },
        {
            $sort: { total: -1 }
        }
    ]);

    const [driveStats, expenseStats, kmsByMonth, expenseByCategory] = await Promise.all([
        driveStatsPromise,
        expenseStatsPromise,
        kmsByMonthPromise,
        expenseByCategoryPromise
    ]);

    const driveData = driveStats[0] || {
        totalKms: 0,
        totalDrives: 0,
        incompleteDrives: 0
    };

    const expenseData = expenseStats[0] || {
        totalSpent: 0,
        totalHst: 0
    };

    const formattedKmsByMonth = kmsByMonth.map((item) => {
        const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' });
        return {
            year: item._id.year,
            month: monthName,
            trips: item.trips,
            totalKms: item.totalKms
        };
    });

    const formattedExpenseCategories = expenseByCategory.map(category => ({
        category: category._id,
        count: category.count,
        hst: Number(category.hst.toFixed(2)),
        total: Number(category.total.toFixed(2))
    }));

    const stats = {
        totalKms: Number((driveData.totalKms || 0).toFixed(2)),
        totalSpent: Number((expenseData.totalSpent || 0).toFixed(2)),
        totalHst: Number((expenseData.totalHst || 0).toFixed(2)),
        totalDrives: driveData.totalDrives,
        incompleteDrives: driveData.incompleteDrives
    };

    const recentDrives = await Drive.find({
        user: userObjectId,
        ...dateFilter
    })
        .sort({ date: -1 })
        .limit(5)
        .select('_id date purpose totalKM startKM endKM status');

    const formattedDrives = recentDrives.map(d => ({
        _id: d._id,
        date: d.date,
        purpose: d.purpose,
        totalKM: d.totalKM,
        status: d.endKM ? 'Completed' : 'Incomplete'
    }));

    const recentExpenses = await Expense.find({
        user: userObjectId,
        ...dateFilter
    })
        .sort({ date: -1 })
        .limit(5)
        .select('date category totalAmount taxAmount');


    return {
        stats,
        kmsByMonth: formattedKmsByMonth,
        expenseByCategory: formattedExpenseCategories,
        recentDrives: formattedDrives,
        recentExpenses
    };
};

module.exports = {
    getDashboardReport
};