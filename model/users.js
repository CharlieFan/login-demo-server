const connection = require('./connection').connection;

const getUserById = function(id) {
    let sql = `SELECT * from users WHERE id = ${id};`;
    connection.connect();

    return new Promise((resolve, reject) => {
        if (!id) {
            let err = new Error('Bad Request');
            err.status = 400;
            reject(err);
        }

        connection.query(sql, function(err, rows, fields) {
            if (err) {
                let err = new Error('Network Error');
                err.status = 500;
                reject(err);
            }
            console.log(rows);
            resolve(rows[0]);
        });
        connection.end();
    });
};

module.exports = {
    getUserById
};
