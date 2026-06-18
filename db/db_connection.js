const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.MYSQLHOST || process.env.DB_HOST || "localhost",
    port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || "3306"),
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_DATABASE,
    connectTimeout: parseInt(process.env.DB_CONNECT_TIMEOUT || "10000")
}

const connection = mysql.createConnection(dbConfig);

module.exports = connection;