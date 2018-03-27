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
 */
const addNew = function (data) {
    if (!data) {
        return Promise.reject(errMaker('no data', 400));
    }
    
    data = dataFormator(data, todoSchema);

    return new Promise((resolve, reject) => {
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

/**
 * Edit a Todo by using todo id
 */
const editSchema = {
    id: {
        type: 'number',
        isRequired: true
    },
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

const updateTodoById = function(data) {
    if (!data) {
        return Promise.reject(errMaker('no data', 400));
    }
    data = dataFormator(data, editSchema);

    return new Promise((resolve, reject) => {
        Promise.all([
            validate({
                value: data.id,
                name: 'todo id'
            }, editSchema.id),
            validate({
                value: data.content,
                name: 'content'
            }, editSchema.content),
            validate({
                value: data.finish,
                name: 'finish'
            }, editSchema.finish),
            validate({
                value: data.owner_id,
                name: 'owner id'
            }, editSchema.owner_id)
        ]).then(() => {
            let sql = 'UPDATE todos SET content = ?, finish = ?, timestamp = ? WHERE todo_id = ?';

            let CURRENT_TIMESTAMP = { toSqlString: function() {
                return 'CURRENT_TIMESTAMP()';
            }};

            pool.query(sql, [
                data.content,
                data.finish,
                CURRENT_TIMESTAMP,
                data.id,
                data.owner_id
            ], function(err) {
                if (err) {
                    return reject(dbErrHandler(err));
                }

                return resolve({msg: 'Updated successfully'});
            });

        }).catch((err) => {
            return reject(errMaker(err, 400));
        });
    });
};

// Get todo list by owner_id
const getTodosListbyId = function(id) {
    if (!id && typeof(id) !== 'number') {
        return Promise.reject(errMaker('invalid id', 400));
    }

    return new Promise((resolve, reject) => {
        let sql = 'SELECT * FROM todos WHERE owner_id = ?';
        
        pool.query(sql, [id], function(err, result) {
            if (err) {
                return reject(dbErrHandler(err));
            }

            if (result && result.length > 0) {
                let reply = result.map((item) => {
                    return {
                        todo_id: item.todo_id,
                        content: item.content,
                        finish: item.finish,
                        timestamp: item.timestamp
                    };
                });

                return resolve(reply);
            }

            return resolve([]);
        });
    });
};

module.exports = {
    addNew,
    updateTodoById,
    getTodosListbyId
};