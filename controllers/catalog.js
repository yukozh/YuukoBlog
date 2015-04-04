'use strict'
var express = require('express');
var router = express.Router();

router.get('/:catalog/:page?', function(req, res, next) {
    let posts;
    let catalog;
    db.catalogs.findOne({ title: new RegExp(['^', req.params.catalog ,'$'].join(''), 'i') })
        .select('_id')
        .exec()
        .then(function (_catalog) {
            catalog = _catalog;
            return db.posts.find({ isPage: false })
                .where({ catalog: catalog._id })
                .sort({ time: -1 })
                .skip(req.params.page ? (req.params.page - 1) * 5 : 0)
                .limit(5)
                .select('title time url catalog tags summary')
                .populate({ path: 'catalog', select: 'title title_zh' })
                .exec()

        })
        .then(function (_posts) {
            posts = _posts;
            return db.posts.find({ catalog: catalog._id, isPage: false }).count();
        })
        .then(function (count) {
            res.render('home/index', {
                style: req.params.catalog.toLocaleLowerCase(),
                posts: posts,
                pageCount: parseInt((count + 5 - 1) / 5)
            });
        })
        .then(null, next);
});

module.exports = router;
