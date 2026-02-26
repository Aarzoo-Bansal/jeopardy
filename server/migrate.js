const pool = require('./config/db')
const fs = require('fs');
const path = require('path');

const runMigrations = async () => {
    try {
        // Creates migrations table if it doesn't exists
        await pool.query(`
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                filename TEXT NOT NULL UNIQUE,
                ran_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('Migration table is ready.')

        // Gets the list of migrations that have already run
        const result = await pool.query('SELECT filename FROM migrations');
        const ranMigrations = result.rows.map(row => row.filename)
        console.log('Already ran:', ranMigrations.length === 0 ? 'none' : ranMigrations.join(', '));
        
        // Read all .sql files from migrations folder, sorted by name
        const migrationFiles = fs.readdirSync(path.join(__dirname, 'migrations'))
            .filter(f => f.endsWith('.sql'))
            .sort();

        // Run only migration files that haven't run yet
        for (const file of migrationFiles) {
            if (ranMigrations.includes(file)){
                console.log(`Skipping file ${file} (already ran)`);
                continue;
            }

            // Read SQL file contents
            const sql = fs.readFileSync(
                path.join(__dirname, 'migrations', file),
                'utf8'
            );

            // Execute the sql command
            await pool.query(sql);

            // Record that this migration ran
            await pool.query(
                'INSERT INTO migrations (filename) VALUES ($1)',
                [file]
            );

            console.log(`Ran migration: ${file}`);
        }

        console.log('All migrations completed');
    } catch (err) {
        console.error('Migration failed: ', err.message);
    } finally {
        await pool.end();
    }
};

runMigrations();