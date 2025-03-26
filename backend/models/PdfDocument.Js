// models/PdfDocument.js
const mongoose = require('mongoose');

const pdfDocumentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  userEmail: {
    type: String,
    required: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  s3Key: {
    type: String,
    required: true,
    trim: true
  },
  s3Url: {
    type: String,
    required: true,
    trim: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
});

const PdfDocument = mongoose.model('PdfDocument', pdfDocumentSchema);

module.exports = PdfDocument;