const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const employeeRoutes = express.Router();

employeeRoutes.get('/dashboard', verifyToken, requireRole('Employee'), );

module.exports = employeeRoutes;
