// routes/pdf.js
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const PdfDocument = require('../models/PdfDocument');

const router = express.Router();
const s3 = new AWS.S3();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10 // Limit file size to 10MB
  }
});

// Upload a PDF to S3
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    // Extract user data from the request
    const { userName, userEmail } = req.body;
    if (!userName || !userEmail) {
      return res.status(400).json({ error: 'User name and email are required' });
    }

    const fileContent = fs.readFileSync(req.file.path);
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `pdfs/${req.file.filename}`,
      Body: fileContent,
      ContentType: 'application/pdf',
      ACL: 'public-read'  // Add this line
    };

    // Upload file to S3
    const s3UploadResult = await s3.upload(params).promise();

    // Create new document in MongoDB
    const newPdfDocument = new PdfDocument({
      userName,
      userEmail,
      fileName: req.file.originalname,
      s3Key: s3UploadResult.Key,
      s3Url: s3UploadResult.Location
    });

    await newPdfDocument.save();

    // Remove temporary file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: 'PDF uploaded successfully',
      document: newPdfDocument
    });
  } catch (error) {
    console.error('Error uploading PDF:', error);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Get all PDF documents
router.get('/', async (req, res) => {
  try {
    const documents = await PdfDocument.find().sort({ uploadDate: -1 });
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching PDF documents:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get a single PDF document by ID
router.get('/:id', async (req, res) => {
  try {
    const document = await PdfDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.status(200).json(document);
  } catch (error) {
    console.error('Error fetching PDF document:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate a pre-signed URL for viewing the PDF
router.get('/view/:id', async (req, res) => {
  try {
    const document = await PdfDocument.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: document.s3Key,
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const url = s3.getSignedUrl('getObject', params);
    res.status(200).json({ url });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;