'use strict';

var express = require('express');
var controller = require('./tweets.controller');

var router = express.Router();

router.get('/:tag', controller.fetchTag);
router.get('/id/:id', controller.fetchTweet);

module.exports = router;