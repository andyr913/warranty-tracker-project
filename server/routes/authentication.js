// this file has all the routes for user authentication

// imports libraries, DB connection pool, validations
const express = require('express');
const bcrypt = require('bcryptjs'); // https://www.npmjs.com/package/bcryptjs
const pool = require('../db');
const {checkRegistration} = require('../registration_vals');

const router = express.Router();

// registration endpoint
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
});

// login endpoint
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // returns empty field errors
    if (!email) return res.status(400).json({error: "Please enter email."})
    if (!password) return res.status(400).json({error: "Please enter password."})

    try {
        // queries for a user in the DB with the same email as login input
        const dbResult = await pool.query(
            "SELECT * FROM users WHERE email = $1", 
            [email.trim.toLowerCase()]
        );
        const user = dbResult.rows[0];
        
        // input validations

        // if DB did not return a user, returns unauthorized error
        if (!user) 
            return res.status(401).json({error: "Invalid email or password. Please try again."});
        // if user has entered the wrong password 5 times, returns locked error
        if (user.failed_pw_count >= 5)
            return res.status(423).json(
                "Account locked due to 5 consecutive invalid password attempts. " +
                "Please contact an administrator to regain access."
            );
        // if user account is disabled, returns forbidden error
        if (!user.is_active)
            return res.status(403).json("This account is inactive and cannot be accessed.");
    } catch (error) {
        // otherwise returns generic server error
        return res.status(500).json({error: 'Login failed. Please try again.'})
    }
});

module.exports = router;