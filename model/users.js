const pool = require('./connection').pool;

const getUserById = function(id) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT * from users WHERE id = ${id};`;

        if (!id) {
            let err = new Error('Bad Request');
            err.status = 400;
            reject(err);
        }

        pool.query(sql, function(err, rows, fields) {
            if (err) {
                let err = new Error('Network Error');
                err.status = 500;
                reject(err);
            }
            // console.log(rows);
            resolve(rows[0]);
        });
    });
};

module.exports = {
    getUserById
};
