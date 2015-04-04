'use strict'
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    let posts;
    db.posts.find({ isPage: false })
        .sort({ time: -1 })
        .limit(5)
        .populate({ path: 'catalog', select: 'title title_zh' })
        .select('title time url catalog tags summary')
        .exec()
        .then(function (_posts) {
            posts = _posts;
            return db.posts.find({ isPage: false }).count();
        })
        .then(function (count) {
            res.render('home/index', {
                posts: posts,
                pageCount: parseInt((count + 5 - 1) / 5)
            });
        })
        .then(null, next);
});

router.get('/page/:page', function(req, res, next) {
    let posts;
    db.posts.find({ isPage: false })
        .sort({ time: -1 })
        .skip((req.params.page - 1) * 5)
        .limit(5)
        .populate({ path: 'catalog', select: 'title title_zh' })
        .select('title time url catalog tags summary')
        .exec()
        .then(function (_posts) {
            posts = _posts;
            return db.posts.find({ isPage: false }).count();
        })
        .then(function (count) {
            res.render('home/index', {
                posts: posts,
                pageCount: parseInt((count + 5 - 1) / 5)
            });
        })
        .then(null, next);
});

module.exports = router;
