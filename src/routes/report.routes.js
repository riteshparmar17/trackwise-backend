const express = require('express');
const auth = require('../middleware/auth.middleware');
const { getDashboardReport } = require('../controllers/report.controller');
const router = express.Router();

router.get('/dashboard', auth(), getDashboardReport);

module.exports = router;