const { db } = require('../services/database');

const logWork = (req, res) => {
  const user_id = req.headers['user-id'];
  const { is_clock_in } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (is_clock_in === undefined) {
    return res.status(400).json({ error: 'is_clock_in is required' });
  }

  const today = new Date().toISOString().slice(0, 10);

  if (is_clock_in) {
    db.get(
      'SELECT * FROM WorkLog WHERE user_id = ? AND DATE(login_time) = ?',
      [user_id, today],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (row) {
          return res.status(400).json({ error: 'User has already clocked in today' });
        }

        db.run(
          'INSERT INTO WorkLog (user_id, login_time) VALUES (?, ?)',
          [user_id, new Date().toISOString()],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
          }
        );
      }
    );
  } else {
    db.get(
      'SELECT * FROM WorkLog WHERE user_id = ? AND DATE(login_time) = ?',
      [user_id, today],
      (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!row) {
          return res.status(400).json({ error: 'User has not clocked in today' });
        }
        if (row.logout_time) {
          return res.status(400).json({ error: 'User has already clocked out today' });
        }

        db.run(
          'UPDATE WorkLog SET logout_time = ? WHERE id = ?',
          [new Date().toISOString(), row.id],
          function (err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ id: row.id });
          }
        );
      }
    );
  }
};

module.exports = {
  logWork,
};