const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { dashboardHr } = require('../controllers/hrController');
const hrRoutes = express.hrRoutes();

hrRoutes.get('/dashboard', verifyToken, requireRole('hr'), dashboardHr);

module.exports = hrRoutes;
