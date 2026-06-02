const express = require('express');
const { getRoles } = require('../controllers/roleController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', auth, roleMiddleware('admin'), getRoles);

module.exports = router;