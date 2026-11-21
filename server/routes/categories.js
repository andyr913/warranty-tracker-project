// routes for asset categories

const express = require('express');
const pool = require('../db');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

// returns all categories for the asset form dropdown
router.get('/', requireAuth, async (req, res) => {
    try {
        const dbResult = await pool.query(
            'SELECT category_id, category_name FROM categories ORDER BY category_name'
        );
        return res.json(dbResult.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to load categories. Please try again.'});
    }
});

module.exports = router;