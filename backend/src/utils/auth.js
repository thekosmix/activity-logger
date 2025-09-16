const jwt = require('jsonwebtoken');
const cache = require('../services/cache');

const generateToken = async (user) => {
  const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, 'your_jwt_secret', { expiresIn: '1h' });
  await cache.set(user.id.toString(), token, 86400);
  return token;
};

const authenticateToken = async (req, res, next) => {
  const userId = req.headers['user-id'];
  const token = req.headers['authorization'];

  if (!userId || !token) {
    return res.sendStatus(401);
  }

  try {
    const cachedToken = await cache.get(userId);
    if (token === cachedToken) {
      req.user = { id: userId };
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { generateToken, authenticateToken };