// this file has all the routes for user authentication

// imports libraries, DB connection pool, validations
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db');
const {checkRegistration} = require('../registration_vals');

const router = express.Router();

router.post('/register', async (req, res) => {
    const {first_name, last_name, email, password} = req.body;
    const checkInput = checkRegistration(first_name, last_name, email, password);

    // if validation fails, returns bad request status code + errors
    if (!checkInput.valid) return res.status(400).json({errors: checkInput.errors});

    try {
        // hashes user password to store in DB
        const pwHash = await bcrypt.hash(checkInput.user.password, 10);

        // inserts user into DB and returns user row - validates input
        const dbResult = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password_hash) 
            VALUES ($1, $2, $3, $4)
            RETURNING user_id, first_name, last_name, email, user_role`,
            [checkInput.user.first_name, checkInput.user.last_name, checkInput.user.email, pwHash]
        );
        // returns user info and status code for created resource
        return res.status(201).json(dbResult.rows[0]);
    } catch (error) {
        // 23505 is returned by db if there is a unique_violation error (user already exists)
        if (error.code === '23505') {
            // returns 'conflict' status code
            return res.status(409).json({error: 'There is a registered account associated with this email.'});
        }

        // otherwise returns generic server error
        return res.status(500).json({error: 'Registration was unsuccessful. Please try again.'})
    }
})

module.exports = router;