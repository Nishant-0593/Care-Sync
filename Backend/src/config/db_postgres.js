const { Pool } = require('pg');

// Syllabus Topic: Starting with PostgreSQL
// This file demonstrates how to connect to a SQL database using the 'pg' library

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'caresync_sql',
    password: 'password',
    port: 5432,
});

const connectPostgres = async () => {
    try {
        // Since we are primarily using MongoDB, we log the attempt
        // In a real environment, you would call pool.connect()
        console.log('PostgreSQL Configuration Loaded (Syllabus: Starting with PostgreSQL)');
        // await pool.connect();
    } catch (error) {
        console.error('PostgreSQL Connection Error:', error.message);
    }
};

module.exports = { pool, connectPostgres };
