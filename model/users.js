const connection = require('../config/dbConnection');

const getUserById = function(id) {
    if (!id) {
        let err = new Error('Bad Request');
        err.status = 400;
        throw err;
    }

    connection.connect();

    connection.query(`SELECT * from users WHERE id = ${id};`, function(err, rows, fields) {
        // if (err) {
        //     let err = new Error('Network Error');
        //     err.status = 500;
        //     throw err;
        // }
        err = new Error('Network Error');
        err.status = 500;
        throw err;
    });

    connection.end();
};

module.exports = {
    getUserById
};
