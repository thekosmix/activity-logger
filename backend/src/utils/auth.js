const jwt = require('jsonwebtoken');
const cache = require('../services/cache');

const generateToken = async (user) => {
  const token = jwt.sign({ id: user.id, is_admin: user.is_admin }, 'your_jwt_secret', { expiresIn: '1h' });
  // Store the token along with user's admin status in cache
  await cache.set(user.id.toString(), { token, is_admin: user.is_admin }, 86400);
  return token;
  //return "token";
};

const authenticateToken = async (req, res, next) => {
  const userId = req.headers['user-id'];
  const token = req.headers['authorization'];

  if (!userId || !token) {
    return res.sendStatus(401);
  }

  try {
    const cachedData = await cache.get(userId);
    if (cachedData && token === cachedData.token) {
      req.user = { id: userId, is_admin: cachedData.is_admin };
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const authenticateAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  const token = req.headers['authorization'];

  if (!userId || !token) {
    return res.sendStatus(401);
  }

  try {
    const cachedData = await cache.get(userId);
    if (cachedData && token === cachedData.token) {
      // Check if the user has admin privileges from cached data
      if (!cachedData.is_admin) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }
      
      req.user = { id: userId, is_admin: cachedData.is_admin };
      next();
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { generateToken, authenticateToken, authenticateAdmin };