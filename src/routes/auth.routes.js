const express = require('express');
const { register, login, verifyEmail, refreshToken, forgotPassword, resetPassword, resendVerification } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);

module.exports = router;