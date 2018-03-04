const bcrypt = require('bcryptjs');

const hashingPass = function (password) {
    return bcrypt.genSalt(10).then((salt) => {
        return bcrypt.hash(password, salt);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

const verifyPass = function (password, hash) {
    return bcrypt.compare(password, hash).then((reply) => {
        if (!reply) return Promise.resolve(false);
        return Promise.resolve(true);
    }).catch((err) => {
        err.status = 500;
        return Promise.reject(err);
    });
};

// hashingPass('12345').then((res) => {
//     console.log(res);
// });

// verifyPass('12345', '$2a$10$Zm1ul/BxzA5cmMhwxgrryOep2TafgekZAJisMZRb4lLF.of7dUzom').then((res) => {
//     console.log(res);
// }).catch((err)=> {
//     console.log(err);
// });

module.exports = {
    hashingPass,
    verifyPass
};
