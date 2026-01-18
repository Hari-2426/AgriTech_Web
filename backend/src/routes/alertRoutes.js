const express = require('express');
const router = express.Router();
const { getAlerts, markAsRead } = require('../controllers/alertController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getAlerts);
router.post('/:id/read', protect, markAsRead);

module.exports = router;
