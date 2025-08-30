
const { db } = require('../services/database');

const getEmployees = (req, res) => {
  db.all('SELECT id, name, phone_number, is_approved, is_admin, image FROM Users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
};

const approveEmployee = (req, res) => {
  const { id, is_approved } = req.body;

  if (!id || is_approved === undefined) {
    return res.status(400).json({ error: 'User ID and approval status are required' });
  }

  db.run('UPDATE Users SET is_approved = ? WHERE id = ?', [is_approved, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Employee approval status updated' });
  });
};

module.exports = {
  getEmployees,
  approveEmployee,
};
