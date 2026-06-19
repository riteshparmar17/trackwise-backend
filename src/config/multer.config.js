const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif'
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return cb(
            new Error('Only JPG, PNG, and WEBP files are allowed')
        );
    }
    cb(null, true);
};

module.exports = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter
});