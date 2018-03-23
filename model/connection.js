const mysql = require('mysql');
const redis = require('redis');
const config = null;
// const config = require('../config/dbconfig.json') || null;

const mySqlConfig = {
    host: process.env.SQL_HOST || config.host,
    user: process.env.SQL_USER || config.user,
    password: process.env.SQL_PASS || config.password,
    database: process.env.SQL_DB || config.database
};

const redisConfig = {
    host: process.env.REDIS_HOST || config.redis.host,
    password: process.env.REDIS_PASS || config.redis.password,
    port: process.env.REDIS_PORT || config.redis.port 
};
// Connection Mysql:
// const connection = mysql.createConnection({
//     host: config.host,
//     user: config.user,
//     password: config.password,
//     database: config.database
// });

const pool = mysql.createPool({
    connectionLimit: 10,
    host: mySqlConfig.host,
    user: mySqlConfig.user,
    password: mySqlConfig.password,
    database: mySqlConfig.database
});

// Client to Redis:
const client = redis.createClient({
    host: redisConfig.host,
    password: redisConfig.password,
    port: redisConfig.port
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

