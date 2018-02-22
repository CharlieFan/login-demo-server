const express = require('express');
const router = express.Router();
const controller = require('../controllers');

/**
 * GET user Info listing
 */
router.get('/getUserInfo', controller.user.getUserInfo);

/**
 * Signup API
 */
router.post('/signup', controller.user.signup);

module.exports = router;
