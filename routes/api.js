const express = require('express');
const router = express.Router();

/**
 * GET user Info listing
 */
router.get('/getUserInfo', function(req, res, next) {
  // res.set('Content-Type', 'application/json')
  res.send({
    name: 'Jane Doe',
    age: 28
  });
});

module.exports = router;
