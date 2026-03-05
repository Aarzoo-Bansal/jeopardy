const { Pool } = require('pg');
require('dotenv').config();

const isTest = process.env.NODE_ENV === 'test';

const pool = isTest ?
    new Pool({
        connectionString: process.env.TEST_DATABASE_URL,
    }) :
    (process.env.DATABASE_URL
        ? new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
        })
        : new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME
        }));

// Testing connection if not a test environment
if (!isTest) {
    pool.query('SELECT NOW()', (err, res) => {
        if (err) {
            console.error('Database connection failed:', err.message)
        } else {
            console.log('Database connected at:', res.rows[0].now);
        }
    });
}

module.exports = pool;