const pool = require('./connection').pool;
const dataFormator = require('./dataUtils').dataFormator;
const dbErrHandler = require('./dataUtils').dbErrhandler;
const errMaker = require('../utils/utils').errorMaker;
const validate = require('../utils/validator').validate;

const todoSchema = {
    content: {
        type: 'text',
        isRequired: true,
        trim: true
    },
    finish: {
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 1
    },
    owner_id: {
        type: 'number',
        isRequired: true
    },
};

/**
 * Add New Todo
 *
 * @param {*} data 
 */
const addNew = function (data) {
    if (!data) {
        return Promise.reject(errMaker('no data', 400));
    }

    return new Promise((resolve, reject) => {
        data = dataFormator(data, todoSchema);
        Promise.all([
            validate({
                value: data.owner_id,
                name: 'owner id'
            }, todoSchema.owner_id),
            validate({
                value: data.content,
                name: 'content'
            }, todoSchema.content),
            validate({
                value: data.finish,
                name: 'finish'
            }, todoSchema.finish)
        ]).then(() => {
            let sql = 'INSERT INTO todos SET owner_id = ?, content = ?, finish = ?, timestamp = ?';

            let CURRENT_TIMESTAMP = { toSqlString: function() {
                return 'CURRENT_TIMESTAMP()';
            }};

            pool.query(sql, [
                data.owner_id,
                data.content,
                data.finish,
                CURRENT_TIMESTAMP
            ], function(err, result) {
                if (err) {
                    return reject(dbErrHandler(err));
                }
                return resolve({id: result.insertId});
            });
        }).catch((err) => {
            return reject(errMaker(err, 400));
        });
    });
};

module.exports = {
    addNew
};