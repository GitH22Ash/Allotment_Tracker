require('dotenv').config();
const { Pool } = require('pg');

// Check if the DATABASE_URL is loaded.
if (!process.env.DATABASE_URL) {
    throw new Error("FATAL ERROR: DATABASE_URL is not defined in backend/.env");
}

console.log("DATABASE_URL found. Initializing connection pool...");

// Initialize the pool with only the connection string.
// This is the most direct and reliable way to connect.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

console.log("Database connection pool successfully initialized.");

module.exports = {
    query: (text, params) => pool.query(text, params),
};
