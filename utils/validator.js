const validateRules = {
    required(value, name) {
        return new Promise((resolve, reject) => {
            if (value) {
                resolve(true);
            } else {
                reject(new Error(`${name} is required`));
            }
        });
    },
    isEmail(value) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        return new Promise((resolve, reject) => {
            if (pattern.test(value)) {
                resolve(true);
            } else {
                reject(new Error('Invalid email format'));
            }
        });
    },
    maxLength(length) {
        return function(value) {
            return new Promise((resolve, reject) => {
                if (value.length >= length) {
                    reject(new Error(`should be less than ${length} charachers`));
                } else {
                    resolve(true);
                }
            });
        };
    },
    minLength(length) {
        return function(value) {
            return new Promise((resolve, reject) => {
                if (value.length < length) {
                    reject(new Error(`should be more than ${length} charachers`));
                } else {
                    resolve(true);
                }
            });
        };
    }
};

const validator = function (field, ...rules) {
    let value = field.value;
    let name = field.name;

    return Promise.all(rules.map((rule) => {
        return rule(value, name);
    }));
};

const validateAll = function(fields, schema,) {

};

module.exports = {
    validateRules,
    validator
};