// imports libraries, DB connection pool, .env variables
const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();

// allows react to call this API from browser
app.use(cors());
// parses JSON request bodies into req.body
app.use(express.json());

// temporary health check to confirm connection is working
app.get('/api/health', async (req, res) => {
  try {
    // queries DB and sends back the result
    const result = await pool.query('SELECT COUNT(*) FROM categories');
    res.json({ status: 'ok', categories: result.rows[0].count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// loads port number for app to listen on
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));

