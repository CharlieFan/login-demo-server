const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate').authenticate;
const controller = require('../controllers');

/**
 * Add Todo:
 */
router.post('/add', authenticate, function(req, res, next) {
    controller.todos.addNew(req).then((reply) => {
        res.status(200).send(reply);
    }).catch((err) => {
        next(err);
    });
});

/**
 * Edit Todo:
 */
router.post('/edit', authenticate, function(req, res, next) {
    controller.todos.editTodo(req).then((reply) => {
        res.status(200).send(reply);
    }).catch((err) => {
        next(err);
    });
});

/**
 * Get Todo list;
 */
router.get('/getList', authenticate, function(req, res, next) {
    controller.todos.getList(req).then((reply) => {
        res.status(200).send(reply);
    }).catch((err) => {
        next(err);
    });
});

module.exports = router;