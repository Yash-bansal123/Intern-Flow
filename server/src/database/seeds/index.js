import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { defaultSkills } from './skills.seed.js';

dotenv.config();

async function runSeeds() {
    console.log('Starting database seeding...');
    
    let connection;
    try {
        const dbName = process.env.DB_NAME || 'internflow';
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: dbName
        });

        console.log('Seeding skills...');
        for (const skill of defaultSkills) {
            await connection.query(
                'INSERT IGNORE INTO skills (name, category, description) VALUES (?, ?, ?)',
                [skill.name, skill.category, skill.description]
            );
        }
        console.log(`✓ Seeded ${defaultSkills.length} skills successfully.`);
        
        // Roles are already seeded in 001_create_roles.sql but we could add an Admin user here
        console.log('Note: Roles are seeded via migrations.');
        
        console.log('All seeding completed successfully!');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runSeeds();
