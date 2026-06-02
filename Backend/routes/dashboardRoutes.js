const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/stats', auth, roleMiddleware('admin', 'operador', 'consulta'), getDashboardStats);

module.exports = router;