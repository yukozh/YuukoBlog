'use strict'
var express = require('express');
var router = express.Router();

router.get('/:year/:month/:page?', function(req, res, next) {
    let posts;
    let begin = new Date(req.params.year, req.params.month - 1, 0, 0, 0);
    let end = new Date(begin).setMonth(req.params.month);
    db.posts.find({ isPage: false })
        .where('time').gte(begin)
        .where('time').lt(end)
        .sort({ time: -1 })
        .skip(req.params.page ? (req.params.page - 1) * 5 : 0)
        .limit(5)
        .select('title time url catalog tags summary')
        .populate({ path: 'catalog', select: 'title title_zh' })
        .exec()
        .then(function (_posts) {
            posts = _posts;
            return db.posts.find({ isPage: false })
                .where('time').gte(begin)
                .where('time').lt(end)
                .count();
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
