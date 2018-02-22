const express = require('express');
const router = express.Router();
const controller = require('../controllers');

/**
 * GET user Info API
 */
router.get('/getUserInfo', controller.user.getUserInfo);

/**
 * Signup API
 */
router.post('/signup', controller.user.signup);

/**
 * Login API
 */
router.post('/login', controller.user.login);

module.exports = router;
