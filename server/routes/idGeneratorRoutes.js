const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { postIdGenerator } = require('../controllers/idGeneratorController');

const idGeneratorRoutes = express.Router();

idGeneratorRoutes.post(
  '/:cardId/generate',
  verifyToken,
  requireRole('Admin'),
  postIdGenerator
);

module.exports = idGeneratorRoutes;
