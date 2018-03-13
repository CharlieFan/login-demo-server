const pool = require('./connection').pool;
const validate = require('../utils/validator').validate;
const redisClient = require('./connection').client;
const errMaker = require('../utils/utils').errorMaker;
const hashing = require('../middleware/hashing');
// console.log(hashing)

const ExpireTime = 60 * 60;

const userSchema = {
    email: {
        type: 'email',
        isRequired: true
    },
    password: {
        type: 'text',
        isRequired: true,
        minLength: 6,
        maxLength: 18
    },
    username: {
        type: 'text',
        minLength: 1,
        maxLength: 30
    }
};

// Save token in redis
const setToken = function(payload) {
    redisClient.on('error', function(err) {
        err.status = 500;
        return Promise.reject(err);
    });

    return new Promise((resolve, reject) => {
        redisClient.set(payload.id, payload.token, 'EX', ExpireTime, function(err, reply) {
            if (err) {
                err.status = 500;
                return reject(err);
            }
           
            if (!reply) return reject(errMaker('Network Error', 500));
            return resolve(payload.token);
        });

    });
};

// Get token from redis
const getToken = function(id) {
    redisClient.on('error', function(err) {
        err.status = 500;
        return Promise.reject(err);
    });

    return new Promise((resolve, reject) => {
        redisClient.get(id, function(err, reply) {
            if (err) {
                err.status = 500;
                // console.log(err)
                return reject(err);
            }
            
            return resolve(reply);
        });

    });
};

// Destroy token from redis
const removeToken = function(id) {
    redisClient.on('error', function(err) {
        err.status = 500;
        return Promise.reject(err);
    });

    return new Promise((resolve, reject) => {
        redisClient.del(id, function(err, reply) {
            if (err) {
                err.status = 500;
                return reject(err);
            }

            return resolve(reply);
        });
    });
};

// select all user info from Mysql
const getUserById = function(id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT username, email from users WHERE id = ${id};`;

        if (!id) return reject(errMaker('Bad Request', 400));

        pool.query(sql, function(err, rows) {
            if (err) return reject(errMaker('Network Error', 500));
            // console.log(rows);
            if (rows.length <=0 ) return reject(errMaker('No User Found', 400));

            return resolve(rows);
        });
    });
};

// select login info:
const getLoginInfo = function(data) {
    if (!data || !data.email || !data.password) return Promise.reject(errMaker('email and password should not be blank', 400));
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, email, password from users WHERE email = '${data.email}'`;
        pool.query(sql, (err, rows) => {
            if (err) return reject(errMaker('Network Error (DB)', 500));

            if (rows.length <= 0) return reject(errMaker('User does not exist', 400));

            return resolve(rows[0]);
        });
    });
};

// Insert user into Mysql
const signupUser = function(data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            let err = new Error('Bad Request');
            err.status = 400;
            return reject(err);
        }

        for(let prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (!data[prop]) {
                    data[prop] = null;
                }
                
                if (prop !== 'password') {
                    data[prop] = data[prop].trim();
                }
            }
        }

        Promise.all([
            validate({value: data.email, name: 'email'}, userSchema.email),
            validate({value: data.password, name: 'password'}, userSchema.password),
            validate({value: data.username, name: 'username'}, userSchema.username)
        ]).then(() => {
            return hashing.hashingPass(data.password);
        }).then((hash) => {
            // console.log(hash);
            let sql = 'INSERT INTO users SET email = ?, password = ?, username = ?, signup_date = ?';
            let CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; }};

            pool.query(sql, [data.email, hash, data.username, CURRENT_TIMESTAMP], function(err, result) {
                if (err) {
                    err.status = 400;
                    return reject(err);
                }
                return resolve({id: result.insertId});
            });
        }).catch((err) => {
            err.status = 400;
            return reject(err);
        });
    });
};

module.exports = {
    setToken,
    removeToken,
    getToken,
    getUserById,
    signupUser,
    getLoginInfo
};
