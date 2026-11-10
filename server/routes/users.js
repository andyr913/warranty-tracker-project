// imports libraries, DB connection pool, validations, authentication proof
const express = require('express');
const pool = require('../db');
const {checkName, checkEmail, checkPassword} = require('../registration_vals');
const {requireAuth} = require('../middleware/auth');

const bcrypt = require('bcryptjs');

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

// update user password route
router.put('/password', requireAuth, async (req, res) => {
    const {current_password, new_password} = req.body;

    if (!current_password)
        return res.status(400).json({error: 'Required field'});

    // validates new password and returns error if not valid
    const passwordCheck = checkPassword(new_password);
    if (!passwordCheck.valid)
        return res.status(400).json({errors: {new_password: passwordCheck.error}});

    try {
        // queries for password hash to confirm current_password matches
        const dbResult = await pool.query(
            'SELECT password_hash FROM users WHERE user_id = $1', [req.user.user_id]
        );

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        // checks if current_password matches the hash, returns error if not
        const pwMatch = await bcrypt.compare(current_password, dbResult.rows[0].password_hash);
        if (!pwMatch) 
            return res.status(401).json({error: 'Current password is incorrect.'});

        // if no error, creates new hash and updates DB
        const newHash = await bcrypt.hash(new_password, 10);
        await pool.query(
            'UPDATE users SET password_hash = $1, last_updated_time = NOW() WHERE user_id = $2',
            [newHash, req.user.user_id]
        );

        return res.json({message: 'Password updated successfully.'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to update password. Please try again.'});
    }
});

module.exports = router;