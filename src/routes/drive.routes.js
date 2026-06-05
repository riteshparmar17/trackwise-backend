const express = require('express');
const auth = require('../middleware/auth.middleware');
const {
    createDrive,
    getDrives,
    getDriveById,
    updateDrive,
    deleteDrive,
    getFilteredDrives } = require('../controllers/drive.controller');
const router = express.Router();

router.post('/createDrive', auth(), createDrive);
router.get('/getDrives', auth(), getDrives);
router.get('/getDriveById/:id', auth(), getDriveById);
router.put('/updateDrive/:id', auth(), updateDrive);
router.delete('/deleteDrive/:id', auth(), deleteDrive);
router.get('/getFilteredDrives', auth(), getFilteredDrives);

module.exports = router;