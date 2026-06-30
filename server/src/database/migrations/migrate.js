import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
    console.log('Starting database migrations...');
    
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            multipleStatements: true
        });

        const dbName = process.env.DB_NAME || 'internflow';
        
        console.log(`Creating database ${dbName} if it doesn't exist...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);

        const files = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ensure they run in numerical order

        for (const file of files) {
            console.log(`Executing migration: ${file}...`);
            const filePath = path.join(__dirname, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            
            await connection.query(sql);
            console.log(`✓ ${file} completed successfully.`);
        }

        console.log('All migrations completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigrations();
