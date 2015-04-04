'use strict'
var express = require('express');
var router = express.Router();
var init = require('../middlewares/init');

var home = require('./home');
var catalog = require('./catalog');
var tag = require('./tag');
var calendar = require('./calendar');
var admin = require('./admin');
var post = require('./post');
var page = require('./page');
var file = require('./file');

router.use(init.base);
router.use(init.catalogs);
router.use(init.allCatalogs);
router.use(init.tags);
router.use(init.calendar);

router.use('/', home);
router.use('/catalog', catalog);
router.use('/tag', tag);
router.use('/calendar', calendar);
router.use('/admin', admin);
router.use('/post', post);
router.use('/file', file);
router.use('/', page);

module.exports = router;
