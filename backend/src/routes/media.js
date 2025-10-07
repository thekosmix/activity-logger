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
 *     parameters:
 *       - in: formData
 *         name: media
 *         schema:
 *           type: file
 *         description: The media file to upload.
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
 *                 filePath:
 *                   type: string
 *                   example: /uploads/1631512345678-my-image.jpg
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/upload', authenticateToken, upload.single('media'), mediaController.uploadMedia);

module.exports = router;
