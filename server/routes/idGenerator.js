const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const bwipjs = require('bwip-js');
const fs = require('fs');
const path = require('path');
const { postIdGenerator } = require('../controllers/idGeneratorController');


const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/generate', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'signatorySignature', maxCount: 1 }
]), postIdGenerator);

module.exports = router