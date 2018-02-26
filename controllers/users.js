const userModule = require('../model/users');


const getUserInfo = function(req, res, next) {
    // console.log(req.query);
    let id = req.query.id;
    if (!id) {
        let err = new Error('id cannot be blank');
        err.status = 400;
        next(err);
    }

    userModule.getUserById(id, next).then((data) => {
        res.send(data);
    }).catch((err) => {
        next(err);
    });
};

const signup = function(req, res) {
    // console.log(req.body);
    res.send(req.body);
};

const login = function(req, res) {
    res.send(req.body);
};

module.exports = {
    signup,
    login,
    getUserInfo
};
