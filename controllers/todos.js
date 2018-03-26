const todoModel = require('../model/todos');
const errorMaker = require('../utils/utils').errorMaker;

// Add New Todo:
const addNew = function (reqBody) {
    console.log(reqBody)
    
    return new Promise((resolve, reject) => {
        todoModel.addNew(reqBody).then((reply) => {

        }).catch((err) => {
            reject(err);
        });
    });
};

module.exports = {
    addNew
};