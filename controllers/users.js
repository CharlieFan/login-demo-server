const userModule = require('../model/users');


const getUserInfo = function(req, res, next) {
    // console.log(req.query);
    let id = req.query.id;
    if (!id) {
        let err = new Error('id cannot be blank');
        err.status = 400;
        throw err;
    }

    userModule.getUserById(id);
    // res.send('ok');
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
