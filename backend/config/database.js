const { Pool } = require('pg');
require('dotenv').config();

// Use DATABASE_URL if available (Render provides this), otherwise use individual vars
const pool = process.env.DATABASE_URL ? 
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    }) :
    new Pool({
        host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
        user: process.env.DB_USER || process.env.PGUSER || 'postgres',
        password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '',
        database: process.env.DB_NAME || process.env.PGDATABASE || 'myresume',
        port: process.env.DB_PORT || process.env.PGPORT || 5432,
        ssl: process.env.DB_SSL === 'true' || process.env.PGSSLMODE ? { rejectUnauthorized: false } : false,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 60000
    });

// Compatibility wrapper to make PostgreSQL work like MySQL
const db = {
    query: async (sql, params) => {
        // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
        let pgSql = sql;
        let paramIndex = 1;
        while (pgSql.includes('?')) {
            pgSql = pgSql.replace('?', `$${paramIndex++}`);
        }
        
        const result = await pool.query(pgSql, params);
        
        // Return MySQL-compatible format [rows, fields]
        return [result.rows, result.fields];
    }
};

// Test connection
pool.connect()
    .then(client => {
        console.log('✓ Database connected successfully');
        client.release();
    })
    .catch(err => {
        console.error('✗ Database connection failed:', err.message);
        console.log('  Please check your database credentials in .env file');
    });

module.exports = db;
