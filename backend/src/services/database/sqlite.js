
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./aclog.db');

const createTables = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone_number TEXT UNIQUE,
        is_approved BOOLEAN DEFAULT 0,
        is_admin BOOLEAN DEFAULT 0,
        image TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        title TEXT,
        description TEXT,
        media_url TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        activity_id INTEGER,
        user_id INTEGER,
        comment TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (activity_id) REFERENCES Activities(id),
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS Locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        latitude REAL,
        longitude REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);
  });
};


const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.error('Error running sql ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve({ id: this.lastID });
      }
    });
  });
}

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, result) => {
      if (err) {
        console.error('Error running sql: ' + sql);
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}


// const run = (sql, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.run(sql, params, function (err) {
//       if (err) {
//         console.error('Error running sql ' + sql);
//         console.error(err);
//         reject(err);
//       } else {
//         resolve({ id: this.lastID });
//       }
//     });
//   });
// }

// const get = (sql, params = []) => {
//   return new Promise((resolve, reject) => {
//     db.get(sql, params, (err, result) => {
//       if (err) {
//         console.error('Error running sql: ' + sql);
//         console.error(err);
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// }

module.exports = {
  db,
  createTables,
  run,
  get,
};


