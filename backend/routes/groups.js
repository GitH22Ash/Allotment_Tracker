const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint: POST /api/groups/register
// Purpose: To register a new project group with 5 members.
router.post('/register', async (req, res) => {
    const { group_name, members } = req.body;

    // Validate the incoming data
    if (!group_name || !members || members.length !== 5) {
        return res.status(400).json({ msg: 'Please provide a group name and exactly 5 members.' });
    }

    try {
        // Step 1: Check if any of the provided students are already in a group.
        // This is the core logic that prevents duplicate student entries across different groups.
        const regNos = members.map(m => m.reg_no);
        const checkStudentQuery = 'SELECT student_reg_no FROM group_members WHERE student_reg_no = ANY($1::varchar[])';
        const existingStudents = await db.query(checkStudentQuery, [regNos]);

        if (existingStudents.rows.length > 0) {
            const existingRegNo = existingStudents.rows[0].student_reg_no;
            return res.status(400).json({ msg: `Student with registration number ${existingRegNo} is already in a group.` });
        }

        // Step 2: Insert the students into the 'students' table.
        // The "ON CONFLICT (reg_no) DO NOTHING" clause prevents errors if a student already exists.
        for (const member of members) {
            const { name, reg_no, cgpa } = member;
            const studentInsertQuery = 'INSERT INTO students (reg_no, name, cgpa) VALUES ($1, $2, $3) ON CONFLICT (reg_no) DO NOTHING';
            await db.query(studentInsertQuery, [reg_no, name, cgpa]);
        }

        // Step 3: Insert the new group into the 'project_groups' table and get the new group's ID.
        const groupInsertQuery = 'INSERT INTO project_groups (group_name) VALUES ($1) RETURNING group_id';
        const newGroup = await db.query(groupInsertQuery, [group_name]);
        const groupId = newGroup.rows[0].group_id;

        // Step 4: Link the members to the newly created group in the 'group_members' junction table.
        for (const member of members) {
            const memberInsertQuery = 'INSERT INTO group_members (group_id, student_reg_no) VALUES ($1, $2)';
            await db.query(memberInsertQuery, [groupId, member.reg_no]);
        }
        
        // Step 5: Create initial (empty) mark entries for each student in the new group.
        for (const member of members) {
            const marksInsertQuery = 'INSERT INTO marks (student_reg_no, group_id) VALUES ($1, $2)';
            await db.query(marksInsertQuery, [member.reg_no, groupId]);
        }

        res.status(201).json({ msg: 'Group registered successfully!', groupId });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;

