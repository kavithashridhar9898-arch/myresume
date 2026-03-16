/* ========================================
   Database Fix Script - Add missing columns
   Run this locally to fix the database schema
   ======================================== */

const { Pool } = require('pg');

// Get database URL from command line
const databaseUrl = process.argv[2];

if (!databaseUrl) {
    console.log('Usage: node fix-database.js <your-render-database-url>');
    console.log('\nExample: node fix-database.js postgres://user:pass@host:5432/dbname');
    process.exit(1);
}

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: {
        rejectUnauthorized: false
    }
});

async function fixDatabase() {
    try {
        console.log('Connecting to database...');
        const client = await pool.connect();
        console.log('✓ Connected successfully!\n');

        // Add display_order column to skills table
        console.log('Adding display_order column to skills table...');
        try {
            await client.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0');
            console.log('✓ display_order column added\n');
        } catch (e) {
            console.log('  Note:', e.message);
        }

        // Add icon column to skills table
        console.log('Adding icon column to skills table...');
        try {
            await client.query('ALTER TABLE skills ADD COLUMN IF NOT EXISTS icon VARCHAR(100)');
            console.log('✓ icon column added\n');
        } catch (e) {
            console.log('  Note:', e.message);
        }

        // Fix media table columns
        console.log('Checking media table columns...');
        try {
            await client.query('ALTER TABLE media ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT \'image\'');
            await client.query('ALTER TABLE media ADD COLUMN IF NOT EXISTS file_name VARCHAR(255)');
            await client.query('ALTER TABLE media ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100)');
            await client.query('ALTER TABLE media ADD COLUMN IF NOT EXISTS alt_text VARCHAR(255)');
            console.log('✓ Media table columns updated\n');
        } catch (e) {
            console.log('  Note:', e.message);
        }

        // Rename filename to file_name if needed
        try {
            await client.query('ALTER TABLE media RENAME COLUMN filename TO file_name');
            console.log('✓ Renamed filename to file_name\n');
        } catch (e) {
            // Column might already be renamed or not exist
        }

        // Verify skills table
        console.log('Verifying skills table structure...');
        const skillsResult = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'skills'
        `);
        console.log('Skills columns:', skillsResult.rows.map(r => r.column_name).join(', '));

        client.release();
        console.log('\n✅ Database fix complete!');
        console.log('\nYou can now use the website normally.');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

fixDatabase();
