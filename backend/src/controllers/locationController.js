
const { db } = require('../services/database');

const updateLocation = (req, res) => {
  const { user_id, latitude, longitude } = req.body;

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

  db.all('SELECT * FROM Locations WHERE user_id = ? ORDER BY timestamp DESC', [userId], (err, rows) => {
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
