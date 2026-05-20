const authService = require('../services/auth.service');

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: 'Registration successful. Please verify your email.',
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const data = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ success: false, message: 'Token is required' });
        }
        const result = await authService.verifyEmail(token);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token is required' });
        }
        const data = await authService.refreshToken(refreshToken);
        res.status(200).json({
            success: true,
            message: 'Refresh token generated successfully!',
            data
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        await authService.forgotPassword(email);
        res.status(200).json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ success: false, message: 'Token and new password are required' });
        }
        await authService.resetPassword(token, newPassword);
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const result = await authService.resendVerification(email);
        res.status(200).json({ success: true, message: result.message });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = {
    register,
    login,
    verifyEmail,
    refreshToken,
    forgotPassword,
    resetPassword,
    resendVerification
};