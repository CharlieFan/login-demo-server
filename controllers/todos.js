const todoModel = require('../model/todos');
const errorMaker = require('../utils/utils').errorMaker;

// Add New Todo:
const addNew = function (reqBody) {
    if (!reqBody) {
        return Promise.reject(errorMaker('no data', 400));
    }

    return new Promise((resolve, reject) => {
        todoModel.addNew(reqBody).then((reply) => {
            if (reply) {
                resolve(reply);
            }
        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    addNew
};