const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { analyzeCrop, getHistory } = require('../controllers/cropController');
const { protect } = require('../middlewares/authMiddleware');

// Multer Storage Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images (jpg, jpeg, png) are allowed'));
    }
});

router.post('/analyze', protect, upload.single('image'), analyzeCrop);
router.get('/history', protect, getHistory);

module.exports = router;
