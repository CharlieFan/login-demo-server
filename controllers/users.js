const userModule = require('../model/users');
// const validator = require('../utils/validator').validator;
// const validateRules = require('../utils/validator').validateRules;

const getUserInfo = function(req, res, next) {
    // console.log(req.query);
    let id = req.query.id;
    if (!id) {
        let err = new Error('id cannot be blank');
        err.status = 400;
        next(err);
    }

    userModule.getUserById(id, next).then((data) => {
        data.length > 0 ? res.send(data[0]) : res.send({});
    }).catch((err) => {
        next(err);
    });
};

const signup = function(req, res, next) {
    // console.log(req.body);
    
    userModule.signupUser(req.body).then((data) => {
        res.send(data);
    }).catch((err) => {
        next(err);
    });
    // res.send(req.body);
};

const login = function(req, res) {
    res.send(req.body);
};

module.exports = {
    signup,
    login,
    getUserInfo
};
