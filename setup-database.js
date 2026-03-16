/* ========================================
   Database Setup Script for Render PostgreSQL
   Run this locally to set up your database tables
   ======================================== */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Get database URL from command line or use Render's external URL
const databaseUrl = process.argv[2];

if (!databaseUrl) {
    console.log('Usage: node setup-database.js <your-render-database-url>');
    console.log('\nTo get your database URL:');
    console.log('1. Go to Render Dashboard → your PostgreSQL database');
    console.log('2. Click "Connect" tab');
    console.log('3. Copy the "External Database URL"');
    console.log('\nExample: node setup-database.js postgres://user:pass@host:5432/dbname');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

// Also try connecting with external URL format if internal fails
const useExternalUrl = databaseUrl.includes('-a/');
if (useExternalUrl) {
    console.log('Note: Using internal database URL. If connection fails, use the external URL from Render dashboard.');
}

async function setupDatabase() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✓ Connected successfully!\n');

        // Read and execute schema
        const schemaPath = path.join(__dirname, 'database', 'schema-postgres.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Creating tables...');
        await client.query(schema);
        console.log('✓ Tables created successfully!\n');

        // Create admin user with proper password hash
        console.log('Creating admin user...');
        const adminPassword = '@Anshulsnkatte';
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        
        await client.query(
            `INSERT INTO users (username, password_hash) 
             VALUES ($1, $2) 
             ON CONFLICT (username) DO UPDATE SET password_hash = $2`,
            ['Anshulsnkatte', passwordHash]
        );
        console.log('✓ Admin user created/updated successfully!');
        console.log('   Username: Anshulsnkatte');
        console.log('   Password: @Anshulsnkatte\n');

        // Insert default profile
        console.log('Creating default profile...');
        await client.query(
            `INSERT INTO profile (name, title, bio, email, phone, location)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            ['Your Name', 'Full Stack Developer', 'Welcome to my portfolio!', 'your.email@example.com', '+1 234 567 890', 'Your Location']
        );
        console.log('✓ Default profile created!\n');

        // Verify setup
        console.log('Verifying setup...');
        const usersResult = await client.query('SELECT COUNT(*) FROM users');
        const profileResult = await client.query('SELECT COUNT(*) FROM profile');
        
        console.log(`✓ Users table: ${usersResult.rows[0].count} user(s)`);
        console.log(`✓ Profile table: ${profileResult.rows[0].count} profile(s)`);

        client.release();
        console.log('\n✅ Database setup complete!');
        console.log('\nYou can now visit your website at:');
        console.log('https://myresume-portfolio.onrender.com');
        console.log('\nAdmin panel: https://myresume-portfolio.onrender.com/admin');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (error.message.includes('password authentication failed')) {
            console.log('\nTip: Make sure you\'re using the correct database URL from Render.');
        }
        if (error.message.includes('does not exist')) {
            console.log('\nTip: The database might not be ready yet. Wait a few minutes and try again.');
        }
        process.exit(1);
    } finally {
        await pool.end();
    }
}

setupDatabase();
