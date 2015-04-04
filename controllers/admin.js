'use strict'
var fs = require('fs');
var express = require('express');
var router = express.Router();
var init = require('../middlewares/init');

router.get('/', init.authorize, function (req, res, next) {
    res.render('admin/index', { config: config });
});

router.post('/', init.authorize, function (req, res, next) {
    config.username = req.body.username;
    if (req.body.password != "")
        config.password = req.body.password;
    config.site = req.body.site;
    config.description = req.body.description;
    config.disqus = req.body.disqus;
    config.avatarUrl = req.body.avatarUrl;
    config.aboutUrl = req.body.aboutUrl;
    fs.writeFileSync(__dirname + '/../config.json', JSON.stringify(config));
    res.send('true');
});

router.get('/login', init.guestOnly, function (req, res, next) {
    res.render('admin/login');
});

router.post('/login', init.guestOnly, function (req, res, next) {
    if (req.body.username === config.username && req.body.password === config.password) {
        req.session.admin = true;
        res.redirect('/admin');
    } else {
        res.render('admin/login');
    }
});

router.post('/post/edit', init.authorize, function (req, res, next) {
    let summary = '';
    let tmp = req.body.content.split('\n');
    if(tmp.length > 16)
    {
        for(let i = 0; i < 16; i++)
            summary += tmp[i] + '\n';
        summary += '\r\n[Read More »](/post/' + req.body.newUrl + ')';
    }
    else
    {
        summary = req.body.content;
    }
    let opt = {
        title: req.body.title,
        url: req.body.newUrl,
        content: req.body.content,
        tags: req.body.tags.trim().split(' '),
        summary: summary,
        isPage: req.body.isPage
    };
    if (req.body.catalog) {
        opt.catalog = req.body.catalog;
    }
    db.posts.update({ url: req.body.url }, opt).exec();
    res.send(res.locals.xss.process(res.locals.md(req.body.content)));
});

router.post('/post/delete', init.authorize, function (req, res, next) {
    db.posts.remove({ url: req.body.url })
        .exec()
        .then(function () {
            res.redirect('/');
        })
        .then(null, next);
});

router.post('/post/new', init.authorize, function (req, res, next) {
    let post = new db.posts();
    post.title = 'Untitled Post';
    post.time = Date.now();
    post.content = '';
    post.summary = '';
    post.tags = [];
    post.url = Math.random().toString(36).replace(/[^a-z]+/g, '');
    post.isPage = false;
    post.save(function (err, post) {
        res.redirect('/post/' + post.url);
    });
});

router.post('/logout', init.authorize, function (req, res, next) {
    delete req.session.admin;
    res.redirect('/');
});

router.get('/catalog', init.authorize, function (req, res, next) {
    res.render('admin/catalog');
});

router.post('/catalog/edit', init.authorize, function (req, res, next) {
    db.catalogs.update({ _id: req.body.id }, {
        title: req.body.title,
        title_zh: req.body.title_zh,
        order: req.body.order
    }).exec();
    res.send('true');
});

router.post('/catalog/delete', init.authorize, function (req, res, next) {
    db.catalogs.remove({ _id: req.body.id }).exec();
    res.send('true');
});

router.post('/catalog/new', init.authorize, function (req, res, next) {
    let catalog = new db.catalogs();
    catalog.title = 'new-catalog';
    catalog.title_zh = '新分类';
    catalog.order = 999;
    catalog.save();
    res.redirect('/admin/catalog');
});

module.exports = router;
