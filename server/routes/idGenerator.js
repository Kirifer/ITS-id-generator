import express from 'express';
import multer from 'multer';
import PDFDocument from 'pdfkit';
import bwipjs from 'bwip-js';
import fs from 'fs';
import path from 'path';

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
]), async (req, res) => {
  try {
    const {
      firstName, lastName, idNumber, position, type,
      emergencyContactName, emergencyContactNumber,
      signatoryName, signatoryPosition, companyAddress,
      barcodeValue
    } = req.body;

    const photoFile = req.files['photo'][0];
    const signatureFile = req.files['signatorySignature'][0];

    // Create PDF
    const doc = new PDFDocument({ size: 'A7', layout: 'landscape' }); // ID card size
    const filePath = `generated/${Date.now()}-${idNumber}.pdf`;
    doc.pipe(fs.createWriteStream(filePath));

    // Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');

    // Front view
    doc.fontSize(10).fillColor('#000').text(`Name: ${firstName} ${lastName}`, 20, 20);
    doc.text(`ID: ${idNumber}`, 20, 35);
    doc.text(`Position: ${position}`, 20, 50);
    doc.text(`Type: ${type}`, 20, 65);
    if (photoFile) doc.image(photoFile.path, 120, 20, { width: 60, height: 60 });

    // Rear view
    doc.text(`Emergency Contact: ${emergencyContactName} - ${emergencyContactNumber}`, 20, 100);
    doc.text(`Signatory: ${signatoryName} (${signatoryPosition})`, 20, 115);
    if (signatureFile) doc.image(signatureFile.path, 120, 100, { width: 60, height: 30 });
    doc.text(`Company: ${companyAddress}`, 20, 140);

    // Barcode generation
    const barcodeBuffer = await bwipjs.toBuffer({
      bcid: 'code128',       // Barcode type
      text: barcodeValue,    // Barcode value
      scale: 2,
      height: 10,
      includetext: true,
      textxalign: 'center'
    });
    doc.image(barcodeBuffer, 20, 160, { width: 160, height: 30 });

    doc.end();

    res.json({ success: true, file: filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'ID Generation failed' });
  }
});

export default router;
