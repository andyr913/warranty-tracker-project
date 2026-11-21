// routes for user asset management

const express = require('express');
const pool = require('../db');
const {checkAsset} = require('../asset_vals');
const {requireAuth} = require('../middleware/auth');

const router = express.Router();

// routes below require user authentication
router.use(requireAuth);

// returns logged in user's assets with their category name
router.get('/', async (req, res) => {
    try {
        const dbResult = await pool.query(
            `SELECT a.asset_id, a.asset_name, a.brand, a.model, a.serial_number,
                    a.purchase_date, a.creation_time,
                    c.category_id, c.category_name
             FROM assets a
             JOIN categories c ON a.category_id = c.category_id
             WHERE a.user_id = $1
             ORDER BY a.creation_time DESC`,
            [req.user.user_id]
        );
        return res.json(dbResult.rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to load assets. Please try again.'});
    }
});

// creates a new asset for logged in user
router.post('/', async (req, res) => {
    const {asset_name, category_id, brand, model, serial_number, purchase_date} = req.body;

    // validates text and date fields
    const checkInput = checkAsset(asset_name, brand, model, serial_number, purchase_date);
    if (!checkInput.valid)
        return res.status(400).json({errors: checkInput.errors});

    // category needs database lookup, so checked here instead
    const categoryId = Number(category_id);
    if (!Number.isInteger(categoryId))
        return res.status(400).json({errors: {category_id: 'Required field'}});

    try {
        // checks that category actually exists in DB
        const categoryResult = await pool.query(
            'SELECT category_id FROM categories WHERE category_id = $1',
            [categoryId]
        );

        if (!categoryResult.rows[0])
            return res.status(400).json({errors: {category_id: 'Invalid value'}});

        // creates new asset
        const dbResult = await pool.query(
            `INSERT INTO assets (user_id, category_id, asset_name, brand, model, serial_number, purchase_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING asset_id, asset_name, brand, model, serial_number, purchase_date`,
            [
                req.user.user_id,
                categoryId,
                checkInput.asset.asset_name,
                checkInput.asset.brand,
                checkInput.asset.model,
                checkInput.asset.serial_number,
                checkInput.asset.purchase_date
            ]
        );

        return res.status(201).json(dbResult.rows[0]);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to create asset. Please try again.'});
    }
});

// deletes an asset of logged in user
router.delete('/:id', async (req, res) => {
    const assetId = Number(req.params.id);

    if (!Number.isInteger(assetId))
        return res.status(400).json({error: 'Invalid ID'});

    try {
        // deletes asset for the specific user
        const dbResult = await pool.query(
            'DELETE FROM assets WHERE asset_id = $1 AND user_id = $2 RETURNING asset_id, asset_name',
            [assetId, req.user.user_id]
        );

        if (!dbResult.rows[0])
            return res.status(404).json({error: 'Asset not found.'});

        return res.json({message: 'Asset successfully deleted.', asset: dbResult.rows[0]});
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: 'Unable to delete asset. Please try again.'});
    }
});

module.exports = router;