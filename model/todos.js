const pool = require('./connection').pool;
const dataFormator = require('./dataUtils').dataFormator;
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
        type: 'email',
        isRequired: true
    },
};

// Add New Todo

const addNew = function (data) {
    data = dataFormator(data, todoSchema);
    console.log(data);
};

module.exports = {
    addNew
};