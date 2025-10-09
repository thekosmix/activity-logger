const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
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
  // Handle multipart/form-data uploads (traditional -F approach)
  if (req.file) {
    // Construct the URL for the uploaded file
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return res.status(200).json({ message: 'File uploaded successfully', url: mediaUrl });
  }
  
  // Handle raw JSON uploads with base64 encoded media data (--data-raw approach)
  if (req.body && req.body.media) {
    const base64Data = req.body.media;
    
    // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,..." or "data:video/mp4;base64,...")
    let base64Image = base64Data;
    let extension = 'dat'; // default extension
    
    if (base64Data.startsWith('data:')) {
      const matches = base64Data.match(/data:([^;]+);base64,(.*)/);
      if (matches && matches.length === 3) {
        const mimeType = matches[1];
        base64Image = matches[2];
        
        // Determine file extension based on MIME type
        if (mimeType.startsWith('image/')) {
          extension = mimeType.split('/')[1];
        } else if (mimeType.startsWith('video/')) {
          extension = mimeType.split('/')[1];
        }
      }
    }
    
    // Convert base64 to buffer
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Generate filename
    const filename = Date.now() + '.' + extension;
    const filePath = path.join('uploads', filename);
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    
    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Construct the URL for the uploaded file
    const mediaUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    return res.status(200).json({ message: 'File uploaded successfully', url: mediaUrl });
  }
  
  // No file found in either format
  return res.status(400).json({ message: 'No file uploaded.' });
};
