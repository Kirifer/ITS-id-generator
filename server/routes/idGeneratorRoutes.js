// server/routes/idGenerator.js

const express = require('express');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { postIdGenerator } = require('../controllers/idGeneratorController');

const idGeneratorRoutes = express.Router();

/*
  Generates ID images for an APPROVED card
  Uses MongoDB ObjectId (internal only)
*/
idGeneratorRoutes.post(
  '/:cardId/generate',
  verifyToken,
  requireRole('Admin'),
  postIdGenerator
);

module.exports = idGeneratorRoutes;
