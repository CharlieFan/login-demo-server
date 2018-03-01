const jwt = require('jsonwebtoken');
const config = require('../config/dbconfig.json');
const errMaker = require('../utils/utils').errorMaker;
const getToken = require('../model/users').getToken;
const ExpireTime = 60 * 60; // ExpireTime in seconds

const generateToken = function(data) {
    return jwt.sign(data, config.redis.salt, { expiresIn: ExpireTime });
};

const authenticate = function(req, res, next) {
    let token = req.get('x-auth');
    let decoded = {};

    try {
        decoded = jwt.verify(token, config.redis.salt);
    } catch (err) {
        // console.log(err);
        err.status = 401;
        return next(err);
    }
    let id = decoded.id;
    if (!id) {
        return next(errMaker('User does not exist', 401));
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
    generateToken,
    ExpireTime
};