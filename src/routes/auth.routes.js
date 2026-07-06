const express = require('express');
const auth = require('../middleware/auth.middleware');
const { register, login, verifyEmail, refreshToken, forgotPassword, resetPassword, resendVerification, changePassword } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);
router.patch('/change-password', auth(), changePassword);

module.exports = router;