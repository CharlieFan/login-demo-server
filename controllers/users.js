const userModule = require('../model/users');
const jwt = require('jsonwebtoken');

const generateToken = function(data) {
    return jwt.sign(data, '12345', { expiresIn: 60 * 60 });
};

// const verifyToken = function (token) {
//     jwt.verify
// };

const getUserInfo = function(req, res, next) {
    // console.log(req.get('x-auth'));
    let token = req.get('x-auth');
    let decoded = {};

    try {
        decoded = jwt.verify(token, '12345');
    } catch (err) {
        err.status = 403;
        next(err);
    }

    let id = decoded.id;
    if (!id) {
        let err = new Error('User does not exist');
        err.status = 403;
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
        let token = generateToken(data);
        res.set({
            'x-auth': token
        });

        res.send({
            code: res.status,
            message: 'ok'
        });
    }).catch((err) => {
        next(err);
    });
};

const login = function(req, res) {
    res.send(req.body);
};

module.exports = {
    signup,
    login,
    getUserInfo
};
