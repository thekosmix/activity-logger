const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const multer = require('multer');
const { authenticateToken } = require('../utils/auth');

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
/**
 * @swagger
 * /api/media/upload:
 *   post:
 *     summary: Upload a media file
 *     description: Uploads a single image or video file.
 *     consumes:
 *       - multipart/form-data
 *       - application/json
 *     parameters:
 *       - in: formData
 *         name: media
 *         schema:
 *           type: file
 *         description: The media file to upload (for multipart).
 *       - in: body
 *         name: body
 *         schema:
 *           type: object
 *           properties:
 *             media:
 *               type: string
 *               description: Base64 encoded media file (for JSON body).
 *         description: The media file to upload as base64 string.
 *     responses:
 *       201:
 *         description: Media uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Media uploaded successfully
 *                 url:
 *                   type: string
 *                   example: http://localhost:3000/uploads/1631512345678-my-image.jpg
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
// Handle both multipart and JSON data uploads - use multer middleware only when content-type is multipart
router.post('/upload', authenticateToken, (req, res, next) => {
  // Check if the request is multipart/form-data
  const isMultipart = req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data');
  
  if (isMultipart) {
    // Use multer middleware for multipart requests
    upload.single('media')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  } else {
    // For non-multipart requests (like JSON), continue to controller
    next();
  }
}, mediaController.uploadMedia);

module.exports = router;
