
const { db } = require('../services/database');

const register = (req, res) => {
  const { name, phone_number, image } = req.body;

  if (!name || !phone_number) {
    return res.status(400).json({ error: 'Name and phone number are required' });
  }

  db.run(
    'INSERT INTO Users (name, phone_number, image) VALUES (?, ?, ?)',
    [name, phone_number, image],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const login = (req, res) => {
  const { phone_number } = req.body;

  if (!phone_number) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  db.get('SELECT * FROM Users WHERE phone_number = ?', [phone_number], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    // In a real application, you would send an OTP here
    res.status(200).json({ message: 'OTP sent successfully' });
  });
};

module.exports = {
  register,
  login,
};
