const express = require('express');
const router = express.Router();
const { registerFarmer, getProfile, updateProfile } = require('../controllers/farmerController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerFarmer);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;
