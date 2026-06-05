const { default: mongoose } = require('mongoose');
const Drive = require('../models/drive.model');

const createDrive = async (userId, data) => {
    const { date, startKM, endKM, purpose, notes } = data;
    if (!date) {
        throw new Error('Date is required');
    }
    if (startKM === undefined || startKM === null) {
        throw new Error('Start KM is required');
    }

    let status = 'pending';
    let totalKM = 0;
    const end = endKM != null && endKM !== '' ? Number(endKM) : null;

    if (end !== null) {
        if (isNaN(end) || isNaN(startKM)) {
            throw new Error('Invalid KM values');
        }

        if (end < startKM) {
            throw new Error('End KM must be greater than Start KM');
        }

        status = 'completed';
        totalKM = end - startKM;
    }

    return await Drive.create({
        user: userId,
        date,
        startKM,
        endKM: end,
        totalKM,
        purpose,
        notes,
        status
    });
};

const getDrives = async (userId) => {
    return await Drive.find({
        user: userId
    }).sort({
        date: -1,
        createdAt: -1
    });
};

const getFilteredDrives = async (userId, filters) => {
    try {
        const { from, to, page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc' } = filters;
        const matchFilter = {
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

            matchFilter.date = {
                $gte: fromDate,
                $lte: toDate
            };
        }

        const sortObj = {};
        sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (page - 1) * limit;

        const [items, total, totalKMs] = await Promise.all([
            Drive.find(matchFilter)
                .sort(sortObj)
                .skip(skip)
                .limit(Number(limit)),

            Drive.countDocuments(matchFilter),

            Drive.aggregate([
                { $match: matchFilter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalKM" }
                    }
                }
            ])
        ]);

        const totalKM = totalKMs.length > 0 ? totalKMs[0].total : 0;

        return {
            items,
            meta: {
                total,
                page: Number(page),
                totalPages: Math.ceil(total / limit),
                totalKM
            }
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

const getDriveById = async (driveId, userId) => {
    const drive = await Drive.findOne({
        _id: driveId,
        user: userId
    });
    if (!drive) {
        throw new Error('Drive log not found');
    }
    return drive;
};

const updateDrive = async (driveId, userId, data) => {
    const drive = await getDriveById(driveId, userId);
    drive.purpose = data.purpose;
    drive.notes = data.notes || '';

    const hasEndKM = data.endKM !== null && data.endKM !== undefined && data.endKM !== '';

    if (hasEndKM) {
        const start = Number(drive.startKM);
        const end = Number(data.endKM);
        if (end < start) {
            throw new Error('End KM must be greater than Start KM');
        }
        drive.endKM = end;
        drive.totalKM = end - start;
        drive.status = 'completed';
    } else {
        drive.endKM = null;
        drive.totalKM = 0;
        drive.status = 'pending';
    }
    return await drive.save();
};

const deleteDrive = async (driveId, userId) => {
    const drive = await Drive.findOneAndDelete({ _id: driveId, user: userId });
    if (!drive) {
        throw new Error('Drive log not found');
    }
    return drive;
};

module.exports = {
    createDrive,
    getDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
    getFilteredDrives
};