const config = require('../config/dbconfig.json');
const mysql = require('mysql');
const redis = require('redis');
// console.log(config.redis);

// Connection Mysql:
// const connection = mysql.createConnection({
//     host: config.host,
//     user: config.user,
//     password: config.password,
//     database: config.database
// });

const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

// Client to Redis:
const client = redis.createClient({
    host: config.redis.host,
    password: config.redis.password,
    port: config.redis.port
});

// client.on('error', function(err) {
//     err.status = 500;
//     console.log(err);
//     // throw err;
// });

module.exports = {
    // connection,
    pool,
    client
};

