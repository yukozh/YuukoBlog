'use strict'
var express = require('express');
var router = express.Router();

router.get('/:tag/:page?', function(req, res, next) {
    let posts;
    db.posts.find({ 'tags': { $elemMatch: { $eq: req.params.tag } }, isPage: false })
        .sort({ time: -1 })
        .skip(req.params.page ? (req.params.page - 1) * 5 : 0)
        .limit(5)
        .select('title time url catalog tags summary')
        .populate({ path: 'catalog', select: 'title title_zh' })
        .exec()
        .then(function (_posts) {
            posts = _posts;
            return db.posts.find({ 'tags': { $elemMatch: { $eq: req.params.tag } }, isPage: false }).count();
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
