const express = require('express');
const router = express.Router();
const copilotController = require('../controllers/copilotController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/query', copilotController.handleCopilotQuery);

module.exports = router;
