'use strict'
var init = {};

init.base = function (req, res, next) {
    res.locals.res = res;
    res.locals.req = req;
    res.locals.xss = xss;
    res.locals.md = md;
    res.locals.title = config.site;
    res.locals.description = config.description;
    res.locals.style = 'home';
    res.locals.config = config;
    res.locals.csrf = req.csrfToken();
    if (req.query.raw) {
        var _render = res.render;
        res.render = function (view, options, fn) {
            options['layout'] = false;
            _render.call(this, view, options, fn);
        }
    }
    next();
};

init.allCatalogs = function (req, res, next) {
    db.catalogs.find()
        .sort('order')
        .exec()
        .then(function (catalogs) {
            res.locals.allCatalogs = catalogs.map(x => x.toObject());
            next();
        })
        .then(null, next);
};

init.catalogs = function (req, res, next) {
    db.posts.aggregate()
        .match({ catalog: { $ne: null }, isPage: false })
        .project('catalog')
        .group({
            _id: '$catalog',
            count: {
                $sum: 1
            }
        })
        .exec()
        .then(function (catalogs) {
            return Promise.all(catalogs.map(x => {
                x.catalog = x._id;
                delete x._id;
                return db.catalogs.populate(x, { path: 'catalog' });
            }));
        })
        .then(function (catalogs) {
            res.locals.catalogs = catalogs;
            next();
        })
        .then(null, next);
};

init.tags = function (req, res, next) {
    db.posts.aggregate()
        .match({ isPage: false })
        .project('tags')
        .unwind('tags')
        .group({
            _id: '$tags',
            count: {
                $sum: 1
            }
        })
        .exec()
        .then(function (tags) {
            res.locals.tags = tags.map(x => {
                x.tag = x._id;
                delete x._id;
                return x;
            }).sort((a, b) => a.tag > b.tag);
            next();
        })
        .then(null, next);
};

init.calendar = function (req, res, next) {
    db.posts.aggregate()
        .match({ isPage: false })
        .project({
            year: { $year: '$time' },
            month: { $month: '$time' }
        })
        .group({
            _id: {
                year: '$year',
                month: '$month'
            },
            count: { $sum: 1 }
        })
        .exec()
        .then(function (calendar) {
            res.locals.calendar = calendar.map(x => {
                x.date = x._id;
                delete x._id;
                return x;
            }).sort((a, b) => {
                if (a.date.year == b.date.year)
                    return a.date.month < b.date.month;
                else
                    return a.date.year < b.date.year;
            });
            next();
        })
        .then(null, next);
};

init.authorize = function (req, res, next) {
    if (req.session.admin)
        return next();
    else
        return res.redirect('/admin/login');
};

init.guestOnly = function (req, res, next) {
    if (req.session.admin)
        return res.redirect('/admin');
    else
        return next();
};

module.exports = init;