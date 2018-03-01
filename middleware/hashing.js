const bcrypt = require('bcryptjs');

const hashingPass = function (password) {
    return bcrypt.genSalt(10).then((salt) => {
        return bcrypt.hash(password, salt);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

module.exports = {
    hashingPass
};
