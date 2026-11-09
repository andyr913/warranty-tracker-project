// imports libraries, DB connection pool, validations, authentication proof
const express = require('express');
const pool = require('../db');
const {checkName, checkEmail} = require('../registration_vals');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

// user profile route for LOGGED IN user
router.get('/profile', requireAuth, async (req, res) => {
    try {
        // queries for user coming from verified JWT token (not from client request)
        const dbResult = await pool.query(
            `SELECT user_id, first_name, last_name, email, user_role, creation_time 
            FROM users WHERE user_id = $1`,
            [req.user.user_id]
        );

        // returns error or user
        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        return res.json(dbResult.rows[0]);
    } catch {
        console.error(error);
        return res.status(500).json({error: 'Could not load profile. Please try again.'});
    }
});
