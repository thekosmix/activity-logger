
const {
  generateToken
} = require('../utils/auth');
const database = require('../services/database');
const cache = require('../services/cache');

// Regular expression for validating email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for validating 10-digit phone number
const phoneRegex = /^[0-9]{10}$/;

// Function to validate identifier
const validateIdentifier = (identifier) => {
  if (emailRegex.test(identifier)) {
    return 'email';
  } else if (phoneRegex.test(identifier)) {
    return 'phone';
  } else {
    return null;
  }
};

exports.register = async (req, res) => {
  const {
    name,
    identifier,
    image
  } = req.body;
  
  // Validate the identifier
  const identifierType = validateIdentifier(identifier);
  if (!identifierType) {
    return res.status(400).json({
      error: 'Please provide a valid email or 10-digit phone number'
    });
  }
  
  try {
    // Check if user already exists with this identifier
    let existingUser;
    if (identifierType === 'email') {
      existingUser = await database.get('SELECT * FROM Users WHERE phone_number = ?', [identifier]);
    } else {
      existingUser = await database.get('SELECT * FROM Users WHERE phone_number = ?', [identifier]);
    }
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User with this identifier already exists'
      });
    }
    
    const user = await database.run(
      'INSERT INTO Users (name, phone_number, is_approved, is_admin, image) VALUES (?, ?, ?, ?, ?)',
      [name, identifier, 0, 0, image]
    );
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};

exports.sendOtp = async (req, res) => {
  const {
    identifier
  } = req.body;
  
  // Validate the identifier
  const identifierType = validateIdentifier(identifier);
  if (!identifierType) {
    return res.status(400).json({
      error: 'Please provide a valid email or 10-digit phone number'
    });
  }
  
  try {
    // The phone_number column in the database will store either phone number or email
    const user = await database.get('SELECT * FROM Users WHERE phone_number = ? AND is_approved = 1', [
      identifier,
    ]);
    if (!user) {
      return res.status(404).json({
        error: 'User not found or not approved'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  //  const otp = "1234"; // Fixed OTP for testing purposes
    await cache.set(identifier, otp, 10 * 60 * 1000); // OTP valid for 10 minutes
    console.log(`OTP for ${identifier}: ${otp}`); // Log OTP for testing purposes

    res.status(200).json({
      message: 'OTP sent successfully'
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};

exports.login = async (req, res) => {
  const {
    identifier,
    otp
  } = req.body;
  
  // Validate the identifier
  const identifierType = validateIdentifier(identifier);
  if (!identifierType) {
    return res.status(400).json({
      error: 'Please provide a valid email or 10-digit phone number'
    });
  }
  
  try {
    const storedOtp = await cache.get(identifier);

    if (!storedOtp || storedOtp != otp) {
      return res.status(400).json({
        error: 'Invalid or expired OTP'
      });
    }

    const user = await database.get('SELECT * FROM Users WHERE phone_number = ? AND is_approved = 1', [
      identifier,
    ]);
    if (!user) {
      return res.status(404).json({
        error: 'User not found or not approved'
      });
    }

    // Clear OTP after successful login
    await cache.del(identifier);

    const token = await generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
};
