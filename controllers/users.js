const userModule = require('../model/users');
const errMaker = require('../utils/utils').errorMaker;
const generateToken = require('../middleware/authenticate').generateToken;

// Get User Information by id
const getUserInfo = function(req) {
    let id = req.id;

    if (!id) {
        return Promise.reject(errMaker('User does not exist', 401));
    }

    return userModule.getUserById(id).then((user) => {
        return Promise.resolve(user[0]);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

// Add Signup a new user
const signup = function(req) {
    return userModule.signupUser(req.body).then((data) => {
        // console.log(data);
        let token = generateToken(data);
        return userModule.setToken({
            id: data.id,
            token
        });
    }).then((token) => {
        if (!token) return Promise.reject(errMaker('Network Error', 500));
        return Promise.resolve(token);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

// Log a user in
const login = function(req, res) {
    res.send(req.body);
};

module.exports = {
    signup,
    login,
    getUserInfo
};
