pg = require('pg')
require('dotenv').config()
const { Pool } = pg

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
})

pool.on('error', (error, client) => {
    console.error("Error connecting to postgres server", error)
})

module.exports = (text, params, callback) => {
    return pool.query(text, params, callback)
}