const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email.util');
const Token = require('../models/token.model');
const crypto = require('crypto');

const generateToken = () => crypto.randomBytes(32).toString('hex');

const generateJWT = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const createAndSendToken = async ({ user, type, subject, path }) => {
    const token = generateToken();
    await Token.create({
        userId: user._id,
        token,
        type,
        expires: new Date(Date.now() + 1000 * 60 * 60) // 1 hour
    });
    const link = `${process.env.FRONTEND_URL}/${path}?token=${token}`;
    const html = `<p>Hi ${user.name},</p><p>Please click the link below:</p><a href="${link}">${subject}</a>`;
    await sendEmail(user.email, subject, html);
};

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already in use');
    const user = await User.create({ name, email, password });
    await createAndSendToken({
        user,
        type: 'verify',
        subject: 'Verify Your Email',
        path: 'verify-email'
    });
    return user;
};

const verifyEmail = async (token) => {
    const record = await Token.findOne({ token, type: 'verify' });
    if (!record || record.expires < new Date()) {
        throw new Error('Invalid or expired token');
    }
    const user = await User.findById(record.userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        return { message: 'Email already verified' };
    }
    user.isVerified = true;
    await user.save();
    await Token.deleteMany({ userId: user._id, type: 'verify' });
    return { message: 'Email verified successfully' };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !await user.comparePassword(password)) {
        throw new Error('Invalid credentials');
    }
    if (!user.isVerified) {
        throw new Error('Email not verified');
    }
    const accessToken = generateJWT(user);
    const refreshToken = generateToken();
    await Token.deleteMany({ userId: user._id, type: 'refresh' });
    await Token.create({
        userId: user._id,
        token: refreshToken,
        type: 'refresh',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    });
    return { user, accessToken, refreshToken };
};

const refreshToken = async (refreshToken) => {
    const record = await Token.findOne({ token: refreshToken, type: 'refresh' });
    if (!record) {
        throw new Error('Invalid or expired refresh token');
    }
    const user = await User.findById(record.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const newAccessToken = generateJWT(user);
    return { accessToken: newAccessToken };
};

const forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email not found');
    await createAndSendToken({
        user,
        type: 'reset',
        subject: 'Reset Your Password',
        path: 'reset-password'
    });
    return { message: 'Password reset email sent successfully' };
};

const resetPassword = async (token, newPassword) => {
    const record = await Token.findOne({ token, type: 'reset' });
    if (!record) {
        throw new Error('Invalid or expired token');
    }
    const user = await User.findById(record.userId);
    if (!user) {
        throw new Error('User not found');
    }
    if (!newPassword) {
        throw new Error('New password is required');
    }
    user.password = newPassword;
    await user.save();
    await record.deleteOne();
};

const resendVerification = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    if (user.isVerified) {
        return { message: 'Email is already verified' };
    }
    const existingToken = await Token.findOne({
        userId: user._id,
        type: 'verify',
        expires: { $gt: new Date() }
    });
    if (existingToken) {
        throw new Error('A verification email has already been sent. Please wait before requesting another email.');
    }
    await Token.deleteMany({ userId: user._id, type: 'verify' });
    await createAndSendToken({
        user,
        type: 'verify',
        subject: 'Verify Your Email',
        path: 'verify-email'
    });
    return { message: 'Verification email sent successfully!' };
};

const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new Error('User not found');
    }
    const isMatch = user.comparePassword(currentPassword);
    if (!isMatch) {
        throw new error('Invalid current password');
    }
    user.password = newPassword;
    await user.save();
    return { message: 'Password updated successfully' };
};

module.exports = {
    register,
    verifyEmail,
    login,
    refreshToken,
    forgotPassword,
    resetPassword,
    resendVerification,
    changePassword
};