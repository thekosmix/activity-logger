
const {
  generateToken
} = require('../utils/auth');
const database = require('../services/database');
const cache = require('../services/cache');

exports.register = async (req, res) => {
  const {
    name,
    phone_number,
    image
  } = req.body;
  try {
    const user = await database.run(
      'INSERT INTO Users (name, phone_number, is_approved, is_admin, image) VALUES (?, ?, ?, ?, ?)',
      [name, phone_number, 0, 0, image]
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
    phone_number
  } = req.body;
  try {
    const user = await database.get('SELECT * FROM Users WHERE phone_number = ? AND is_approved = 1', [
      phone_number,
    ]);
    if (!user) {
      return res.status(404).json({
        error: 'User not found or not approved'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    await cache.set(phone_number, otp, 10 * 60 * 1000); // OTP valid for 10 minutes
    console.log(`OTP for ${phone_number}: ${otp}`); // Log OTP for testing purposes

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
    phone_number,
    otp
  } = req.body;
  try {
    const storedOtp = await cache.get(phone_number);

    if (!storedOtp || storedOtp != otp) {
      return res.status(400).json({
        error: 'Invalid or expired OTP'
      });
    }

    const user = await database.get('SELECT * FROM Users WHERE phone_number = ? AND is_approved = 1', [
      phone_number,
    ]);
    if (!user) {
      return res.status(404).json({
        error: 'User not found or not approved'
      });
    }

    // Clear OTP after successful login
    await cache.del(phone_number);

    const token = generateToken(user);
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
