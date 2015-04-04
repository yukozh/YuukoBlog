'use strict'
var express = require('express');
var router = express.Router();

router.get('/:url', function(req, res, next) {
    db.posts.findOne({ url: req.params.url })
        .select('url title content time tags catalog time isPage')
        .populate({ path: 'catalog', select: 'title title_zh' })
        .exec()
        .then(function (post) {
            if (!post) {
                res.status(404);
                next();
            }
            let tags = '';
            post.tags.forEach(x => {
                tags += x + ' ';
            });
            tags = tags.trim();
            res.render('post/index', {
                title: post.title,
                style: post.catalog ? post.catalog.title.toLocaleLowerCase() : 'home',
                post: post,
                postTags: tags
            });
        })
        .then(null, next);
});

module.exports = router;
