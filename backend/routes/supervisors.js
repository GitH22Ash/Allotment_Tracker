const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const auth = require('../middleware/auth');

// @route   POST api/supervisors/register
// @desc    Register a new supervisor
// @access  Public
router.post('/register', async (req, res) => {
    const { emp_id, name, email, password } = req.body;

    // Simple validation
    if (!emp_id || !name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        // Check for existing supervisor by email or emp_id
        const existingSupervisor = await db.query(
            "SELECT * FROM supervisors WHERE email = $1 OR emp_id = $2",
            [email, emp_id]
        );

        if (existingSupervisor.rows.length > 0) {
            return res.status(400).json({ msg: 'Supervisor with this email or employee ID already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insert new supervisor into the database
        const newSupervisor = await db.query(
            "INSERT INTO supervisors (emp_id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING emp_id, name, email",
            [emp_id, name, email, password_hash]
        );

        res.status(201).json({
            msg: "Supervisor registered successfully!",
            supervisor: newSupervisor.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// @route   POST api/supervisors/login
// @desc    Authenticate supervisor & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM supervisors WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const supervisor = result.rows[0];
        const isMatch = await bcrypt.compare(password, supervisor.password_hash);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            supervisor: {
                id: supervisor.emp_id,
                name: supervisor.name,
            },
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/my-groups
// @desc    Get all groups assigned to the logged-in supervisor
// @access  Private
router.get('/my-groups', auth, async (req, res) => {
    try {
        const supervisorId = req.supervisor.id;
        const groupsResult = await db.query(
            `SELECT pg.group_id, pg.group_name
             FROM project_groups pg
             WHERE pg.assigned_supervisor_id = $1`,
            [supervisorId]
        );

        const groups = groupsResult.rows;

        for (let group of groups) {
            const membersResult = await db.query(
                `SELECT s.reg_no, s.name, s.cgpa, m.review1_marks, m.review2_marks, m.review3_marks, m.review4_marks
                 FROM students s
                 JOIN group_members gm ON s.reg_no = gm.student_reg_no
                 LEFT JOIN marks m ON s.reg_no = m.student_reg_no AND gm.group_id = m.group_id
                 WHERE gm.group_id = $1`,
                [group.group_id]
            );
            group.members = membersResult.rows;
        }

        res.json(groups);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/marks
// @desc    Update marks for a student
// @access  Private
router.put('/marks', auth, async (req, res) => {
    const { student_reg_no, group_id, review_number, marks } = req.body;
    const reviewColumn = `review${review_number}_marks`;

    if (![1, 2, 3, 4].includes(review_number)) {
        return res.status(400).json({ msg: 'Invalid review number.' });
    }

    try {
        // Check if a marks entry already exists
        const existingMark = await db.query(
            'SELECT * FROM marks WHERE student_reg_no = $1 AND group_id = $2',
            [student_reg_no, group_id]
        );

        if (existingMark.rows.length > 0) {
            // Update existing entry
            await db.query(
                `UPDATE marks SET ${reviewColumn} = $1 WHERE student_reg_no = $2 AND group_id = $3`,
                [marks, student_reg_no, group_id]
            );
        } else {
            // Insert new entry
            await db.query(
                `INSERT INTO marks (student_reg_no, group_id, ${reviewColumn}) VALUES ($1, $2, $3)`,
                [student_reg_no, group_id, marks]
            );
        }
        res.json({ msg: 'Marks updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

