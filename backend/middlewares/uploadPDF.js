// uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set up storage configuration
const lecturesStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs/lectures/'); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Set the filename to be unique
  },
});

// Set up file filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

// Set up multer with defined storage and file filter
const uploadLecture = multer({
  storage: lecturesStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

module.exports = {uploadLecture};
