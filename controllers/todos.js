const todoModel = require('../model/todos');
const errorMaker = require('../utils/utils').errorMaker;

// Add New Todo:
const addNew = function(req) {
    if (!req) {
        return Promise.reject(errorMaker('bad request', 400));
    }

    let data = Object.assign({
        owner_id: req.id
    }, req.body);

    return new Promise((resolve, reject) => {
        todoModel.addNew(data).then((reply) => {
            if (reply) {
                resolve(reply);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

// Edit a Todo:
const editTodo = function(req) {
    if (!req) return Promise.reject(errorMaker('bad request'), 400);

    let data = Object.assign({
        owner_id: req.id
    }, req.body);

    return new Promise((resolve, reject) => {
        todoModel.updateTodoById(data).then((reply) => {
            resolve(reply);
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    addNew,
    editTodo
};