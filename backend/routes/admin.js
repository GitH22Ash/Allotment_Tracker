const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// Endpoint: GET /api/admin/supervisors
// Purpose: Get all registered supervisors with their current group counts
router.get('/supervisors', async (req, res) => {
    try {
        const query = `
            SELECT 
                s.emp_id, 
                s.name, 
                s.email,
                COALESCE(s.max_groups, 5) as max_groups,
                COUNT(pg.group_id) as current_groups
            FROM supervisors s
            LEFT JOIN project_groups pg ON s.emp_id = pg.assigned_supervisor_id
            GROUP BY s.emp_id, s.name, s.email, s.max_groups
            ORDER BY s.name
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Endpoint: GET /api/admin/groups
// Purpose: Get all registered groups with their assignment status
router.get('/groups', async (req, res) => {
    try {
        const query = `
            SELECT 
                pg.group_id,
                pg.group_name,
                pg.assigned_supervisor_id,
                s.name as supervisor_name,
                COUNT(gm.student_reg_no) as member_count
            FROM project_groups pg
            LEFT JOIN supervisors s ON pg.assigned_supervisor_id = s.emp_id
            LEFT JOIN group_members gm ON pg.group_id = gm.group_id
            GROUP BY pg.group_id, pg.group_name, pg.assigned_supervisor_id, s.name
            ORDER BY pg.group_name
        `;
        const result = await db.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Endpoint: PUT /api/admin/groups/:groupId/assign
// Purpose: Manually assign a specific group to a specific supervisor
router.put('/groups/:groupId/assign', async (req, res) => {
    const { groupId } = req.params;
    const { supervisorId } = req.body;

    try {
        // Check if supervisor exists and get their current group count
        const supervisorCheck = await db.query(`
            SELECT 
                s.emp_id, 
                COALESCE(s.max_groups, 5) as max_groups,
                COUNT(pg.group_id) as current_groups
            FROM supervisors s
            LEFT JOIN project_groups pg ON s.emp_id = pg.assigned_supervisor_id
            WHERE s.emp_id = $1
            GROUP BY s.emp_id, s.max_groups
        `, [supervisorId]);

        if (supervisorCheck.rows.length === 0) {
            return res.status(404).json({ msg: 'Supervisor not found' });
        }

        const supervisor = supervisorCheck.rows[0];
        if (supervisor.current_groups >= supervisor.max_groups) {
            return res.status(400).json({ 
                msg: `Supervisor has reached maximum capacity (${supervisor.max_groups} groups)` 
            });
        }

        // Check if group exists
        const groupCheck = await db.query('SELECT group_id FROM project_groups WHERE group_id = $1', [groupId]);
        if (groupCheck.rows.length === 0) {
            return res.status(404).json({ msg: 'Group not found' });
        }

        // Assign the group
        await db.query(
            'UPDATE project_groups SET assigned_supervisor_id = $1 WHERE group_id = $2',
            [supervisorId, groupId]
        );

        res.json({ msg: 'Group assigned successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Endpoint: PUT /api/admin/groups/:groupId/unassign
// Purpose: Unassign a group from its current supervisor
router.put('/groups/:groupId/unassign', async (req, res) => {
    const { groupId } = req.params;

    try {
        await db.query(
            'UPDATE project_groups SET assigned_supervisor_id = NULL WHERE group_id = $1',
            [groupId]
        );
        res.json({ msg: 'Group unassigned successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Endpoint: POST /api/admin/supervisors/create
// Purpose: To create a new supervisor account. This is an admin-level task.
router.post('/supervisors/create', async (req, res) => {
    const { emp_id, name, email, password } = req.body;
    try {
        // Hash the password before storing it for security
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert the new supervisor into the database
        // "ON CONFLICT(emp_id) DO NOTHING" prevents errors if a supervisor with that ID already exists
        const query = 'INSERT INTO supervisors (emp_id, name, email, password_hash) VALUES ($1, $2, $3, $4) ON CONFLICT(emp_id) DO NOTHING';
        await db.query(query, [emp_id, name, email, password_hash]);
        
        res.status(201).json({ msg: 'Supervisor created successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Endpoint: POST /api/admin/assign-groups
// Purpose: To automatically and randomly assign all unassigned groups to supervisors based on their preferences.
router.post('/assign-groups', async (req, res) => {
    try {
        // Step 1: Fetch all groups that don't have a supervisor yet.
        const groupsRes = await db.query('SELECT group_id FROM project_groups WHERE assigned_supervisor_id IS NULL');
        
        // Step 2: Fetch all available supervisors with their preferences and current group counts.
        const supervisorsRes = await db.query(`
            SELECT 
                s.emp_id, 
                COALESCE(s.max_groups, 5) as max_groups,
                COUNT(pg.group_id) as current_groups
            FROM supervisors s
            LEFT JOIN project_groups pg ON s.emp_id = pg.assigned_supervisor_id
            GROUP BY s.emp_id, s.max_groups
        `);
        
        let groups = groupsRes.rows;
        const supervisors = supervisorsRes.rows;

        // Handle edge cases where assignment is not possible
        if (supervisors.length === 0) {
            return res.status(400).json({ msg: 'No supervisors available to assign groups.' });
        }
        if (groups.length === 0) {
            return res.status(200).json({ msg: 'No unassigned groups to assign.' });
        }

        // Step 3: Filter supervisors who can still take more groups
        const availableSupervisors = supervisors.filter(s => s.current_groups < s.max_groups);
        
        if (availableSupervisors.length === 0) {
            return res.status(400).json({ msg: 'All supervisors have reached their maximum group capacity.' });
        }

        // Step 4: Create a weighted list of supervisors based on remaining capacity
        const supervisorPool = [];
        availableSupervisors.forEach(supervisor => {
            const remainingCapacity = supervisor.max_groups - supervisor.current_groups;
            // Add supervisor multiple times based on remaining capacity for fair distribution
            for (let i = 0; i < remainingCapacity; i++) {
                supervisorPool.push(supervisor.emp_id);
            }
        });

        // Step 5: Shuffle the groups array to ensure random distribution.
        groups.sort(() => 0.5 - Math.random());
        
        // Also shuffle the supervisor pool
        supervisorPool.sort(() => 0.5 - Math.random());

        // Step 6: Assign groups to supervisors
        let poolIndex = 0;
        let assignedCount = 0;
        
        for (const group of groups) {
            if (poolIndex >= supervisorPool.length) {
                // If we've exhausted the pool, break (some groups may remain unassigned)
                break;
            }
            
            const supervisorId = supervisorPool[poolIndex];
            const updateQuery = 'UPDATE project_groups SET assigned_supervisor_id = $1 WHERE group_id = $2';
            await db.query(updateQuery, [supervisorId, group.group_id]);
            
            assignedCount++;
            poolIndex++;
        }

        const remainingGroups = groups.length - assignedCount;
        let message = `${assignedCount} groups assigned successfully.`;
        if (remainingGroups > 0) {
            message += ` ${remainingGroups} groups remain unassigned due to supervisor capacity limits.`;
        }
        
        res.status(200).json({ msg: message });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;