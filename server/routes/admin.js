// imports libraries, DB connection pool, validations, authentication proof
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const {checkPassword} = require('../registration_vals');
const {requireAuth, requireAdmin} = require('../middleware/auth');

const router = express.Router();

// requires all routes below to authenticate logged in admin
router.use(requireAuth, requireAdmin);

// route to get all registered users
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

// route to delete user account
router.delete('/users/:id', async (req, res) => {
    // the ID of the user to delete
    const userId = Number(req.params.id);

    // checks that user ID is a valid integer
    if (!Number.isInteger(userId)) 
        return res.status(400).json({error: 'Invalid ID'});

    try {
        // tries to delete user from DB and return user ID and email
        const dbResult = await pool.query(
            'DELETE FROM users WHERE user_id = $1 RETURNING user_id, email',
            [userId] 
        );

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        return res.json({message: 'User successfully deleted.', user: dbResult.rows[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to delete user. Please try again.'});
    }
});


module.exports = router;