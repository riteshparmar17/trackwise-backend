const User = require('../models/user.model');

const getProfile = async (userId) => {
    const user = await User.findById(userId).select('name email');
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const updateProfile = async (userId, data) => {
    const { name } = data;
    if (!name || name.trim().length === 0) {
        throw new Error('Name is required');
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name: name.trim() },
        { new: true }
    ).select('name email');

    if (!updatedUser) {
        throw new Error('User not found');
    }
    return updatedUser;
};

module.exports = {
    getProfile,
    updateProfile
};