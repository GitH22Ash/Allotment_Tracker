const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

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
// Purpose: To automatically and randomly assign all unassigned groups to all available supervisors.
router.post('/assign-groups', async (req, res) => {
    try {
        // Step 1: Fetch all groups that don't have a supervisor yet.
        const groupsRes = await db.query('SELECT group_id FROM project_groups WHERE assigned_supervisor_id IS NULL');
        
        // Step 2: Fetch all available supervisors.
        const supervisorsRes = await db.query('SELECT emp_id FROM supervisors');
        
        let groups = groupsRes.rows;
        const supervisors = supervisorsRes.rows;

        // Handle edge cases where assignment is not possible
        if (supervisors.length === 0) {
            return res.status(400).json({ msg: 'No supervisors available to assign groups.' });
        }
        if (groups.length === 0) {
            return res.status(200).json({ msg: 'No unassigned groups to assign.' });
        }

        // Step 3: Shuffle the groups array to ensure random distribution.
        groups.sort(() => 0.5 - Math.random());

        // Step 4: Distribute the groups to supervisors in a round-robin fashion.
        // This ensures the groups are divided as evenly as possible.
        let supervisorIndex = 0;
        for (const group of groups) {
            const supervisorId = supervisors[supervisorIndex].emp_id;
            const updateQuery = 'UPDATE project_groups SET assigned_supervisor_id = $1 WHERE group_id = $2';
            await db.query(updateQuery, [supervisorId, group.group_id]);
            
            // Move to the next supervisor, looping back to the start if necessary
            supervisorIndex = (supervisorIndex + 1) % supervisors.length;
        }

        res.status(200).json({ msg: 'Groups assigned successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

