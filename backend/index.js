require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Import routes
const groupRoutes = require('./routes/groups');
const adminRoutes = require('./routes/admin');
const supervisorRoutes = require('./routes/supervisors');

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Define API routes
app.use('/api/groups', groupRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/supervisors', supervisorRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

