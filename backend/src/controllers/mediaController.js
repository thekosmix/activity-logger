const multer = require('multer');
const path = require('path');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Files will be saved in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent overwriting
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Filter for image and video files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

exports.uploadMedia = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  // Construct the URL for the uploaded file
  // Assuming the server is accessible at some base URL and 'uploads' is served statically
  const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ message: 'File uploaded successfully', url: mediaUrl });
};
