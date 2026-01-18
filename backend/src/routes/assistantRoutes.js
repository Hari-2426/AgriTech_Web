const express = require('express');
const router = express.Router();
const { handleQuery } = require('../controllers/assistantController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/query', protect, handleQuery);

module.exports = router;
