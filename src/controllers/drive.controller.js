const driveService = require('../services/drive.service');

const createDrive = async (req, res) => {
    try {
        const drive = await driveService.createDrive(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Drive log created successfully',
            data: drive
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDrives = async (req, res) => {
    try {
        const drives = await driveService.getDrives(req.user.id);
        res.status(200).json({
            success: true,
            message: 'Drive logs retrieved successfully',
            data: drives
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getDriveById = async (req, res) => {
    try {
        const drive = await driveService.getDriveById(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Drive log retrieved successfully',
            data: drive
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateDrive = async (req, res) => {
    try {
        const drive = await driveService.updateDrive(req.params.id, req.user.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Drive log updated successfully',
            data: drive
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const deleteDrive = async (req, res) => {
    try {
        const drive = await driveService.deleteDrive(req.params.id, req.user.id);
        res.status(200).json({
            success: true,
            message: 'Drive log deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const getFilteredDrives = async (req, res) => {
    try {
        const drives = await driveService.getFilteredDrives(req.user.id, req.query);

        return res.status(200).json({
            success: true,
            data: drives
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || 'Something went wrong'
        });
    }
};

module.exports = {
    createDrive,
    getDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
    getFilteredDrives
};
