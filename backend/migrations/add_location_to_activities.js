const { db } = require('../src/services/database');

// Function to add latitude and longitude columns to Activities table
const addLocationToActivities = () => {
  console.log('Starting migration: Add latitude and longitude columns to Activities table');
  
  // Check if the columns already exist
  db.all("PRAGMA table_info(Activities)", [], (err, rows) => {
    if (err) {
      console.error('Error checking table schema:', err.message);
      return;
    }

    const columnNames = rows.map(row => row.name);
    const hasLatitude = columnNames.includes('latitude');
    const hasLongitude = columnNames.includes('longitude');

    if (hasLatitude && hasLongitude) {
      console.log('Columns latitude and longitude already exist');
      return;
    }

    // Add the latitude and longitude columns
    const addLatitudeSql = hasLatitude ? '' : 'ALTER TABLE Activities ADD COLUMN latitude REAL;';
    const addLongitudeSql = hasLongitude ? '' : 'ALTER TABLE Activities ADD COLUMN longitude REAL;';

    db.serialize(() => {
      if (!hasLatitude) {
        console.log('Adding latitude column...');
        db.run(addLatitudeSql, (err) => {
          if (err) {
            console.error('Error adding latitude column:', err.message);
            return;
          }
          console.log('Successfully added latitude column');
        });
      }

      if (!hasLongitude) {
        console.log('Adding longitude column...');
        db.run(addLongitudeSql, (err) => {
          if (err) {
            console.error('Error adding longitude column:', err.message);
            return;
          }
          console.log('Successfully added longitude column');
        });
      }
    });
    
    console.log('Migration completed');
  });
};

module.exports = { addLocationToActivities };