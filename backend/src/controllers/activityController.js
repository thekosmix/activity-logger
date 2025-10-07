
const { db } = require('../services/database');

const getActivityFeed = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  db.all(
    'SELECT a.*, u.name as user_name FROM Activities a JOIN Users u ON a.user_id = u.id ORDER BY a.timestamp DESC LIMIT ? OFFSET ?',
    [limit, offset],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json(rows);
    }
  );
};

const createActivity = (req, res) => {
  const user_id = req.headers['user-id'];
  const { title, description, media_url } = req.body;

  if (!user_id || !title || !description) {
    return res.status(400).json({ error: 'User ID, title, and description are required' });
  }

  db.run(
    'INSERT INTO Activities (user_id, title, description, media_url) VALUES (?, ?, ?, ?)',
    [user_id, title, description, media_url],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

const addComment = (req, res) => {
  const { activityId } = req.params;
  const user_id = req.headers['user-id'];
  const { comment } = req.body;

  if (!user_id || !comment) {
    return res.status(400).json({ error: 'User ID and comment are required' });
  }

  db.run(
    'INSERT INTO Comments (activity_id, user_id, comment) VALUES (?, ?, ?)',
    [activityId, user_id, comment],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
};

module.exports = {
  getActivityFeed,
  createActivity,
  addComment,
};
