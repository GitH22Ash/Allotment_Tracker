require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db'); // Ensure db is imported to initialize the pool

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // This allows the server to accept JSON in the request body

// --- API Routes ---
// Import route files
const groupRoutes = require('./routes/groups');
const supervisorRoutes = require('./routes/supervisors');
const adminRoutes = require('./routes/admin');

// Use the routes
// Any request starting with /api/groups will be handled by groupRoutes
app.use('/api/groups', groupRoutes); 

// Any request starting with /api/supervisors will be handled by supervisorRoutes
app.use('/api/supervisors', supervisorRoutes);

// Any request starting with /api/admin will be handled by adminRoutes
app.use('/api/admin', adminRoutes);
 

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

