export const generateResumePoint = (task) => {
    const { title, description, task_type } = task;
    
    // Simple logic for phase 1
    const actionWords = ['Implement', 'Develop', 'Design', 'Create', 'Build', 'Fix', 'Resolve'];
    let action = 'Developed';
    
    for (const word of actionWords) {
        if (title.toLowerCase().includes(word.toLowerCase())) {
            action = word;
            break;
        }
    }

    if (task_type === 'bug') {
        action = 'Resolved';
    } else if (task_type === 'documentation') {
        action = 'Authored';
    }

    // Attempt to extract keywords (very basic)
    const techRegex = /(React|Node\.js|Express|MySQL|MongoDB|JWT|Socket\.io|Redux)/ig;
    const matches = title.match(techRegex) || (description ? description.match(techRegex) : []);
    const uniqueTech = [...new Set((matches || []).map(t => t.toUpperCase()))];
    
    let techString = uniqueTech.length > 0 ? ` using ${uniqueTech.join(', ')}` : '';

    return `${action} ${title.replace(new RegExp(`^${action}`, 'i'), '').trim()}${techString}, contributing to project success.`;
};
