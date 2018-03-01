const pool = require('./connection').pool;
const validate = require('../utils/validator').validate;
const redisClient = require('./connection').client;
const errMaker = require('../utils/utils').errorMaker;

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

const setToken = function(payload) {
    redisClient.on('error', function(err) {
        err.status = 500;
        return Promise.reject(err);
    });

    return new Promise((resolve, reject) => {
        redisClient.set(payload.id, payload.token, function(err, reply) {
            if (err) {
                err.status = 500;
                return reject(err);
            }
            
            return resolve(payload.token);
        });

    });
};

const getToken = function(id) {
    redisClient.on('error', function(err) {
        err.status = 500;
        return Promise.reject(err);
    });

    return new Promise((resolve, reject) => {
        redisClient.get(id, function(err, reply) {
            if (err) {
                err.status = 500;
                console.log(err)
                
                return reject(err);
            }
            
            return resolve(reply);
        });

    });
};

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
        ]).then(function() {
            let sql = 'INSERT INTO users SET email = ?, password = ?, username = ?, signup_date = ?';
            let CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; }};

            pool.query(sql, [data.email, data.password, data.username, CURRENT_TIMESTAMP], function(err, result) {
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
    getToken,
    getUserById,
    signupUser
};
