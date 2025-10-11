
const { db } = require('../services/database');

const updateLocation = (req, res) => {
  const user_id = req.headers['user-id'];
  const { latitude, longitude } = req.body;

  if (!user_id || !latitude || !longitude) {
    return res.status(400).json({ error: 'User ID, latitude, and longitude are required' });
  }

  db.run(
    'INSERT INTO Locations (user_id, latitude, longitude) VALUES (?, ?, ?)',
    [user_id, latitude, longitude],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const getLocation = (req, res) => {
  const { userId } = req.params;
  const { from, to } = req.query;

  let query = 'SELECT * FROM Locations WHERE user_id = ?';
  let params = [userId];

  // Add date range filters if provided
  if (from) {
    query += ' AND timestamp >= ?';
    params.push(from);
  }
  if (to) {
    query += ' AND timestamp <= ?';
    params.push(to);
  }

  query += ' ORDER BY timestamp DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

module.exports = {
  updateLocation,
  getLocation,
};
