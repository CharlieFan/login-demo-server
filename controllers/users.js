const userModel = require('../model/users');
const errorMaker = require('../utils/utils').errorMaker;
const generateToken = require('../middleware/authenticate').generateToken;
const verifyPass = require('../middleware/hashing').verifyPass;
// console.log(hashing);

// Get User Information by id
const logout = function(id) {
    return userModel.removeToken(id).then((reply) => {
        if (reply) {
            return Promise.resolve({
                message: 'logout successfully'
            });
        }
    }).catch((err) => {
        return Promise.reject(err);
    });
};


const getUserInfo = function(req) {
    let id = req.id;

    if (!id) {
        return Promise.reject(errorMaker('User does not exist', 401));
    }

    return userModel.getUserById(id).then((user) => {
        return Promise.resolve(user[0]);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

// Add Signup a new user
const signup = function(req) {
    return userModel.signupUser(req.body).then((data) => {
        // console.log(data);
        let token = generateToken(data);
        return userModel.setToken({
            id: data.id,
            token
        });
    }).then((token) => {
        if (!token) return Promise.reject(errorMaker('Network Error', 500));
        return Promise.resolve(token);
    }).catch((err) => {
        return Promise.reject(err);
    });
};

// Log a user in
const login = function(req) {
    return userModel.getLoginInfo(req.body).then((reply) => {
        let password = req.body.password;
        let hash = reply.password;
        let id = reply.id;

        return verifyPass(password, hash).then((reply) => {
            if (!reply) return Promise.reject(errorMaker('Email or Password are wrong', 401));

            let token = generateToken({id});
            return userModel.setToken({
                id,
                token
            }).then(() => {
                return Promise.resolve({
                    id,
                    token
                });
            });
        }).catch((err) => {
            return Promise.reject(err);
        });
    }).catch((err) => {
        return Promise.reject(err);
    });
};

module.exports = {
    signup,
    login,
    getUserInfo,
    logout
};
