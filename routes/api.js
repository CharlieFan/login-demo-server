const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate').authenticate;
const controller = require('../controllers');

/**
 * GET user Info API
 */
router.get('/getUserInfo', authenticate, function(req, res, next) {
    controller.user.getUserInfo(req)
        .then((user) => {
            res.send(user);
        }).catch((err) => {
            next(err);
        });
});

/**
 * Signup API
 */
router.post('/signup', function(req, res, next) {
    controller.user.signup(req).then((token) => {
        res.set({
            'x-auth': token
        });

        res.status(200).send({
            message: 'signuped user successfully'
        });
    }).catch((err) => {
        next(err);
    });
});

/**
 * Login API
 */
router.post('/login', controller.user.login);

module.exports = router;
