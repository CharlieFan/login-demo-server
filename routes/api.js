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
router.post('/login', function(req, res, next) {
    controller.user.login(req).then((reply) => {
        res.set({
            'x-auth': reply.token
        });

        res.status(200).send({
            id: reply.id
        });
    }).catch((err) => {
        // console.log(err);
        next(err);
    });
});

/**
 * Logout API
 */
router.post('/logout', authenticate, function(req, res, next) {
    let id = req.id;
    controller.user.logout(id).then((reply) => {
        res.status(200).send(reply);
    }).catch((err) => {
        next(err);
    });
});

/**
 * Add Todo:
 */
router.post('/todos/add', authenticate, function(req, res, next) {
    let data = Object.assign({
        owner_id: req.id
    }, req.body, req.id);
    // res.status(200).send(data);
    // console.log(data)
    
    controller.todos.addNew(data).then((reply) => {
        res.status(200).send(reply);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;
