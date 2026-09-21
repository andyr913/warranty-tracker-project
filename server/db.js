// imports Pool class from Postgres library and .env variables into process.env
const { Pool } = require('pg');
require('dotenv').config();

// creates new connection pool with DB credentials
const pool = new Pool({
  connectionString: process.env.DB_CONNECTION,
  ssl: { rejectUnauthorized: false }
});

// exports connection pool so it can be used in other files
module.exports = pool;