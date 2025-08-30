
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const createTables = () => {
  db.serialize(() => {
    db.run(`
      CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        phone_number TEXT UNIQUE,
        is_approved BOOLEAN DEFAULT 0,
        is_admin BOOLEAN DEFAULT 0,
        image TEXT
      )
    `);

    db.run(`
      CREATE TABLE Activities (
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
      CREATE TABLE Comments (
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
      CREATE TABLE Locations (
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

module.exports = {
  db,
  createTables,
};
