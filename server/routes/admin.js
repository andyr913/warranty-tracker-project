// imports libraries, DB connection pool, validations, authentication proof
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const {checkPassword} = require('../registration_vals');
const {requireAuth, requireAdmin} = require('../middleware/auth');

const router = express.Router();

// requires all routes below to authenticate logged in admin
router.use(requireAuth, requireAdmin);

// get all registered users route
router.get('/users', async (req, res) => {
    try {
        // queries for all users
        const dbResult = await pool.query(
            `SELECT user_id, first_name, last_name, email, user_role,
                    is_active, failed_pw_count, creation_time
             FROM users ORDER BY user_id`
        );

        return res.json(dbResult.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to load users. Please try again.'});
    }
});

module.exports = router;