import pool from './src/config/database.js';

const skillsList = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS', 'Docker', 'Machine Learning', 'Figma'];
const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
const taskStatuses = ['todo', 'in_progress', 'in_review', 'done'];

async function seedData() {
    console.log('Seeding tasks and skills...');

    try {
        // 1. Get all interns
        const [interns] = await pool.query(`SELECT id FROM users WHERE role_id = 3`);
        
        if (interns.length === 0) {
            console.log('No interns found. Exiting.');
            return;
        }

        // 2. Ensure skills exist
        for (const skillName of skillsList) {
            await pool.query(`INSERT IGNORE INTO skills (name, category) VALUES (?, ?)`, [skillName, 'Technical']);
        }
        const [skills] = await pool.query(`SELECT id, name FROM skills`);

        // 3. Assign skills to interns
        let skillsCount = 0;
        for (const intern of interns) {
            // Assign 3 to 5 random skills
            const numSkills = Math.floor(Math.random() * 3) + 3;
            const shuffledSkills = [...skills].sort(() => 0.5 - Math.random());
            const selectedSkills = shuffledSkills.slice(0, numSkills);

            for (const skill of selectedSkills) {
                const level = levels[Math.floor(Math.random() * levels.length)];
                await pool.query(
                    `INSERT IGNORE INTO user_skills (user_id, skill_id, current_level) VALUES (?, ?, ?)`,
                    [intern.id, skill.id, level]
                );
                skillsCount++;
            }
        }
        console.log(`Seeded ${skillsCount} user_skills.`);

        // 4. Assign tasks to interns
        // First get a project id
        const [admin] = await pool.query(`SELECT id FROM users WHERE role_id = 1 LIMIT 1`);
        const adminId = admin[0] ? admin[0].id : null;
        let [projects] = await pool.query(`SELECT id FROM projects LIMIT 1`);
        if (projects.length === 0) {
            // Create a dummy project
            const [projResult] = await pool.query(
                `INSERT INTO projects (name, description, status, created_by) VALUES (?, ?, ?, ?)`,
                ['InternFlow Development', 'Building the core InternFlow platform', 'active', adminId]
            );
            projects = [{ id: projResult.insertId }];
        }
        const projectId = projects[0].id;

        let tasksCount = 0;
        for (const intern of interns) {
            // Create 5 to 10 tasks for each intern
            const numTasks = Math.floor(Math.random() * 6) + 5;
            for (let i = 0; i < numTasks; i++) {
                const status = taskStatuses[Math.floor(Math.random() * taskStatuses.length)];
                const title = `Task ${i+1} for Intern ${intern.id}`;
                await pool.query(
                    `INSERT INTO tasks (project_id, title, description, status, priority, assignee_id, reporter_id, story_points) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        projectId, 
                        title, 
                        `Description for ${title}`, 
                        status, 
                        ['low', 'medium', 'high'][Math.floor(Math.random() * 3)], 
                        intern.id,
                        adminId, // using adminId as reporter_id
                        Math.floor(Math.random() * 8) + 1
                    ]
                );
                tasksCount++;
            }
        }
        console.log(`Seeded ${tasksCount} tasks.`);

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        pool.end();
    }
}

seedData();
