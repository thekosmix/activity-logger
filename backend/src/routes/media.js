const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multer = require('multer');

// Configure multer for file uploads (same configuration as in controller, but needed here for middleware)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST /api/media/upload - Uploads a single media file
router.post('/upload', upload.single('media'), mediaController.uploadMedia);

module.exports = router;
