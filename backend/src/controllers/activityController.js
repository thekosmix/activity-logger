
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
  const { title, description, media_url, latitude, longitude } = req.body;

  if (!user_id || !title || !description) {
    return res.status(400).json({ error: 'User ID, title, and description are required' });
  }

  // Validate coordinates if provided
  if ((latitude !== undefined && isNaN(latitude)) || (longitude !== undefined && isNaN(longitude))) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numbers if provided' });
  }

  db.run(
    'INSERT INTO Activities (user_id, title, description, media_url, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)',
    [user_id, title, description, media_url, latitude, longitude],
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

const getActivityDetail = (req, res) => {
  const { activityId } = req.params;
  
  // Query to get activity details with user name
  const activityQuery = `
    SELECT a.*, u.name as user_name 
    FROM Activities a 
    JOIN Users u ON a.user_id = u.id 
    WHERE a.id = ?
  `;

  // Query to get comments for the activity with user names, ordered by timestamp descending
  const commentsQuery = `
    SELECT c.*, u.name as user_name 
    FROM Comments c 
    JOIN Users u ON c.user_id = u.id 
    WHERE c.activity_id = ? 
    ORDER BY c.timestamp DESC
  `;

  db.get(activityQuery, [activityId], (err, activity) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    db.all(commentsQuery, [activityId], (err, comments) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({
        activity: activity,
        comments: comments
      });
    });
  });
};

module.exports = {
  getActivityFeed,
  createActivity,
  addComment,
  getActivityDetail,
};
