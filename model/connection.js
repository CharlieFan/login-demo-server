const config = require('../config/dbconfig.json');
const mysql = require('mysql');
// console.log(config.password, config.host, config.user, config.database);

// Connection
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});


module.exports = {
    connection,
    pool
};

