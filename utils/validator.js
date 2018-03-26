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
    isEmail(value, name) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

        return new Promise((resolve, reject) => {
            if (pattern.test(value)) {
                resolve(true);
            } else {
                reject(new Error(`${name} is in Invalid email format`));
            }
        });
    },
    isNumber(value, name) {
        return new Promise((resolve, reject) => {
            if (typeof(value) !== 'number') {
                reject(new Error(`${name} must be a number`))
            } else {
                resolve(true);
            }
        });
    },
    maxLength(length) {
        return function(value, name) {
            return new Promise((resolve, reject) => {
                let valueLength;
                if (!value) {
                    valueLength = 0;
                } else {
                    valueLength = value.length;
                }
                
                if (valueLength >= length) {
                    reject(new Error(`${name} should be less than ${length} charachers`));
                } else {
                    resolve(true);
                }
            });
        };
    },
    minLength(length) {
        return function(value, name) {
            return new Promise((resolve, reject) => {
                let valueLength;
                if (!value) {
                    valueLength = 0;
                } else {
                    valueLength = value.length;
                }

                if (valueLength < length) {
                    reject(new Error(`${name} should be more than ${length} charachers`));
                } else {
                    resolve(true);
                }
            });
        };
    },
    max(limit) {
        if (typeof(limit) !== 'number') {
            throw new Error('param must be a number');
        }

        return function(value, name) {
            return new Promise((resolve, reject) => {
                if (value > limit) {
                    reject(new Error(`${name} should be less than ${limit}`));
                } else {
                    resolve(true);
                }
            });
        };
    },
    min(limit) {
        if (typeof(limit) !== 'number') {
            throw new Error('param must be a number');
        }

        return function(value, name) {
            return new Promise((resolve, reject) => {
                if (value < limit) {
                    reject(new Error(`${name} should be larger than ${limit}`));
                } else {
                    resolve(true);
                }
            });
        };
    },
};

const validator = function (field, ...rules) {
    let value = field.value;
    let name = field.name;

    return Promise.all(rules.map((rule) => {
        return rule(value, name);
    }));
};

const validate = function(field, schema) {
    let rules = [];
    if (!field || !schema) {
        return false;
    }

    if (schema.isRequired) {
        rules.push(validateRules.required);
    }

    switch (schema.type) {
        case 'email':
            rules.push(validateRules.isEmail);
            break;
        case 'number':
            rules.push(validateRules.isNumber);
            break;
        default:
            break;
    }

    if (schema.minLength) {
        rules.push(validateRules.minLength(schema.minLength));
    }

    if (schema.maxLength) {
        rules.push(validateRules.maxLength(schema.maxLength));
    }

    return validator(field, ...rules);
};

module.exports = {
    validateRules,
    validator,
    validate
};