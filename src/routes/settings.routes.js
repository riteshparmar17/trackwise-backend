const express = require('express');
const auth = require('../middleware/auth.middleware');
const { getProfile, updateProfile } = require('../controllers/settings.controller');
const router = express.Router();

router.get('/profile', auth(), getProfile);
router.put('/profile', auth(), updateProfile);

module.exports = router;