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
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Could not load profile. Please try again.'});
    }
});

// update user details route
router.put('/profile', requireAuth, async (req, res) => {
    const {first_name, last_name, email} = req.body;
    const errors = {};

    // validates new details
    const nameCheck = checkName(first_name, last_name);
    const emailCheck = checkEmail(email);

    // adds errors to 'errors' object if validations fail
    if (!nameCheck.valid) errors.name = nameCheck.error;
    if (!emailCheck.valid) errors.email = emailCheck.error;

    // if errors object is NOT empty after validations, returns errors
    if (Object.keys(errors).length > 0) 
        return res.status(400).json({errors});

    try {
        // queries DB for user update and returns the updated user
        const dbResult = await pool.query(
            `UPDATE users 
            SET first_name = $1, last_name = $2, email = $3, last_updated_time = NOW()
            WHERE user_id = $4
            RETURNING user_id, first_name, last_name, email, user_role`,
            [first_name.trim(), last_name.trim(), email.trim().toLowerCase(), req.user.user_id]
        );

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        return res.json(dbResult.rows[0]);
    } catch (error) {
        // code 23505 means another account has that email
        if (error.code === '23505')
            return res.status(409).json({error: 'An account with this email already exists.'});

        console.error(error);
        return res.status(500).json({error: 'Unable to update profile. Please try again.'});
    }
});

module.exports = router;