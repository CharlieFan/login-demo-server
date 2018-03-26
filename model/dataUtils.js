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

module.exports = {
    dataFormator
};