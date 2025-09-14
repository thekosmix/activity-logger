const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, is_admin: user.is_admin }, 'your_jwt_secret', { expiresIn: '1h' });
};

module.exports = { generateToken };
