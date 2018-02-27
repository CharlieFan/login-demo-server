const pool = require('./connection').pool;
const validator = require('../utils/validator').validator;
const validateRules = require('../utils/validator').validateRules;
const validate = require('../utils/validator').validate;

const userSchema = {
    email: {
        type: 'email',
        isRequired: true,
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

const getUserById = function(id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT username, email from users WHERE id = ${id};`;

        if (!id) {
            let err = new Error('Bad Request');
            err.status = 400;
            reject(err);
            return false;
        }

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                let err = new Error('Network Error');
                err.status = 500;
                reject(err);
                return false;
            }
            // console.log(rows);
            resolve(rows);
            return false;
        });
    });
};

const signupUser = function(data) {
    return new Promise((resolve, reject) => {
        if (!data) {
            let err = new Error('Bad Request');
            err.status = 400;
            reject(err);
            return false;
        }

        for(let prop in data) {
            if (data.hasOwnProperty(prop)) {
                if (!data[prop]) {
                    data[prop] = null;
                }
            }
        }

        Promise.all([
            validate({value: data.email, name: 'email'}, userSchema.email),
            validate({value: data.password, name: 'password'}, userSchema.password),
            validate({value: data.username, name: 'username'}, userSchema.username)
        ]).then(() => {
            let sql = 'INSERT INTO users SET email = ?, password = ?, username = ?, signup_date = ?';
            let CURRENT_TIMESTAMP = { toSqlString: function() { return 'CURRENT_TIMESTAMP()'; }};

            pool.query(sql, [data.email, data.password, data.username, CURRENT_TIMESTAMP], function(err, result, fields) {
                if (err) {
                    err.status = 400;
                    reject(err);
                    return false;
                }
                resolve({id: result.insertId});
                return false;
            });
        }).catch((err) => {
            err.status = 400;
            reject(err);
        });
    });
};

module.exports = {
    getUserById,
    signupUser
};
