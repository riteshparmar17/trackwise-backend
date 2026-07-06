const settingsService = require('../services/settings.service');

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await settingsService.getProfile(userId);
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedProfile = await settingsService.updateProfile(userId, req.body);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProfile
};