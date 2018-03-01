const jwt = require('jsonwebtoken');
const errMaker = require('../utils/utils').errorMaker;
const getToken = require('../model/users').getToken;

const generateToken = function(data) {
    return jwt.sign(data, '12345', { expiresIn: 60 * 60 });
};

const authenticate = function(req, res, next) {
    let token = req.get('x-auth');
    let decoded = {};

    try {
        decoded = jwt.verify(token, '12345');
    } catch (err) {
        // console.log(err);
        err.status = 401;
        next(err);
    }
    let id = decoded.id;
    if (!id) {
        next(errMaker('User does not exist', 401));
    }

    getToken(id).then((reply) => {
        if (reply === token) {
            req.id = id;

            next();
        } else {
            next(errMaker('Authentication failed', 401));
        }
    }).catch((err) => {
        next(err);
    });
};

module.exports = {
    authenticate,
    generateToken
};