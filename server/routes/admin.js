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

    // error if admin tries deleting own account
    if (userId === req.user.user_id)
        return res.status(400).json({error: "Cannot delete own admin account."})

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

// route to reset a user's password
router.post('/users/:id/reset-password', async (req, res) => {
    // the ID of the user to update
    const userId = Number(req.params.id);

    // checks that user ID is a valid integer
    if (!Number.isInteger(userId)) 
        return res.status(400).json({error: 'Invalid ID'});

    // gets and validates new password
    const {new_password} = req.body;
    const passwordCheck = checkPassword(new_password);

    if (!passwordCheck.valid)
        return res.status(400).json({errors: {new_password: passwordCheck.error}});

    try {
        // generates new hash and updates DB
        const newHash = await bcrypt.hash(new_password, 10);
        const dbResult = await pool.query(
            `UPDATE users
            SET password_hash = $1, failed_pw_count = 0, last_updated_time = NOW()
            WHERE user_id = $2
            RETURNING user_id, email`,
            [newHash, userId]
        );

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        return res.json({message: 'Password successfully reset.', user: dbResult.rows[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to reset password. Please try again.'});
    }

});

// route to unlock a locked account (failed password attempt limit)
router.post('/users/:id/unlock', async (req, res) => {
    // the ID of the user to unlock
    const userId = Number(req.params.id);

    // checks that user ID is a valid integer
    if (!Number.isInteger(userId)) 
        return res.status(400).json({error: 'Invalid ID'});

    try {
        const dbResult = await pool.query(
            `UPDATE users
            SET failed_pw_count = 0, last_updated_time = NOW()
            WHERE user_id = $1
            RETURNING user_id, email, failed_pw_count`,
            [userId]
        )

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'User not found.'});

        return res.json({message: 'Account successfully unlocked.', user: dbResult.rows[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to unlock account. Please try again.'});
    }
});

module.exports = router;