
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./aclog.db');

const createCacheTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Cache (
      key TEXT PRIMARY KEY,
      value TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

const get = (key) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM Cache WHERE key = ?', [key], (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row ? JSON.parse(row.value) : null);
    });
  });
};

const set = (key, value, ttl) => {
  return new Promise((resolve, reject) => {
    const expires = new Date(Date.now() + ttl * 1000);
    db.run(
      'INSERT OR REPLACE INTO Cache (key, value, timestamp) VALUES (?, ?, ?)',
      [key, JSON.stringify(value), expires],
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    );
  });
};

const del = (key) => {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM Cache WHERE key = ?', [key], (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
};

module.exports = {
  createCacheTable,
  get,
  set,
  del,
};
