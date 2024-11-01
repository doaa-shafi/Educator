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

const CVStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs/cv/'); // Set the destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Set the filename to be unique
  },
});

const instructorPhotoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs/instructors/'); // Set the destination directory for uploaded files
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

const imageFileFilter = (req, file, cb) => {
  // List of allowed MIME types for images
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  // Check if the uploaded file's MIME type is in the allowed types
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid file type. Only image files are allowed (JPEG, PNG, GIF, etc.).'), false); // Reject the file
  }
};

// Set up multer with defined storage and file filter
const uploadLecture = multer({
  storage: lecturesStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

const uploadCV= multer({
  storage: CVStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

const uploadInstructorPhoto= multer({
  storage: instructorPhotoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limit file size to 10MB
});

module.exports = {uploadLecture,uploadCV,uploadInstructorPhoto};
