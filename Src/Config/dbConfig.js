const mysql = require('mysql2');
require('dotenv').config();


const dbConfig = {
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:parseInt(process.env.DB_PORT, 10),
};


const pool = mysql.createPool(dbConfig);

// Check the database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Database connected successfully!');
        connection.release();
    }
});

module.exports = pool.promise();