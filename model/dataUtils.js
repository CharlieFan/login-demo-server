const dataFormator = function(data, schema) {
    if (!data || !schema) {
        return {};
    }

    for (let prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            if (!data[prop]) {
                let defaultV = schema[prop].hasOwnProperty('defaultValue') ? schema[prop].defaultValue : null;
                data[prop] = defaultV;
            }

            if (schema[prop].isTrim && data[prop]) {
                data[prop] = data[prop].trim();
            }
        }
    }

    return data;
};

const dbErrhandler = function(err) {
    let code = err.code;
    let newError = new Error();
    let errValue = '';

    switch (code) {
        case 'ER_DUP_ENTRY':
            errValue = err.sqlMessage.split('\'')[1];
            newError.message = `${errValue} is already exist`;
            newError.status = 400;
            return newError;
        default:
            newError.message = code;
            newError.status = 500;
            return newError;
    }
};

module.exports = {
    dataFormator,
    dbErrhandler
};