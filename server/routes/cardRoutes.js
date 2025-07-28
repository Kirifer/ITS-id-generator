const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // ← This line is required!

const {
  getAllCards,
  createCard,
  getCardByIdNo,
  updateCard,
  deleteCard,
} = require('../controllers/cardController');

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Routes
router.get('/', getAllCards);
router.post('/', upload.single('image'), createCard);
router.get('/by-idno/:id_no', getCardByIdNo);
router.put('/by-idno/:id_no', updateCard);
router.delete('/by-idno/:id_no', deleteCard);

module.exports = router;
