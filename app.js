'use strict'
var os = require('os');
var _ = GLOBAL._ = require('underscore');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf = require('csurf');
var xss = GLOBAL.xss = require('./lib/xss');
var moment = GLOBAL.moment = require('moment');
var md = GLOBAL.md = require('marked');
var multer = require('multer');
var session = require('express-session');
var config = GLOBAL.config = require('./lib/configurations');
md.setOptions({
    renderer: new md.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});
var db = GLOBAL.db = require('./models');
var expressLayouts = require('express-ejs-layouts');

var routes = require('./controllers/index');

var app = express();

// view engine setup
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: os.tmpdir() }));
app.use(cookieParser());
app.use(session({ secret: 'yuuko', resave: false, saveUninitialized: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(csrf());

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('shared/error', {
            message: err.message,
            error: err,
            layout: false
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('shared/error', {
        message: err.message,
        error: {},
        layout: false
    });
});

module.exports = app;