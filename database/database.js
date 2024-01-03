const mysql = require('mysql')
require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.DBHOST,
    database: process.env.DBDATABASE,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD
})

module.exports = pool