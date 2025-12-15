// server/routes/idGenerator.js
const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { postIdGenerator } = require('../controllers/idGeneratorController');

const idGeneratorRoutes = express.Router();

idGeneratorRoutes.post(
  '/:id/generate',
  verifyToken,
  requireRole('Admin'),
  postIdGenerator
);

module.exports = idGeneratorRoutes;
