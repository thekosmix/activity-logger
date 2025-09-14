
const express = require('express');

const cors = require('cors');
const { createTables } = require('./services/database');
const { createCacheTable } = require('./services/cache');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const activityRoutes = require('./routes/activities');
const locationRoutes = require('./routes/location');
const mediaRoutes = require('./routes/media');

app.use('/uploads', express.static('uploads'));

const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./utils/swagger');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use(cors());
app.use(express.json());

// Create database tables
createTables();

// Create cache table
createCacheTable();

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/media', mediaRoutes);

app.get('/', (req, res) => {
  res.send('Activity Logger API is running!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
