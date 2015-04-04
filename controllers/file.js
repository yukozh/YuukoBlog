'use strict'
var express = require('express');
var router = express.Router();

router.post('/upload', function (req, res, next) {
    let result = {};
    if (!req.session.admin) {
        result.code = 403;
        result.msg = 'Forbidden';
        return res.send(JSON.stringify(result));
    }
    console.log(req.files);
    if(!req.files.file) {
        result.code = 400;
        result.msg = 'File not found';
        return res.send(JSON.stringify(result));
    }
    var writestream = db.gfs.createWriteStream({
        filename: req.files.file.originalname
    });
    db.fs.createReadStream(req.files.file.path).pipe(writestream);
    writestream.on('close', function (file) {
        result.code = 200;
        result.fileId = file._id;
        db.fs.unlink(req.files.file.path);
        return res.send(JSON.stringify(result));
    });
});

router.get('/download/:id', function (req, res, next) {
    let ObjectID = db.mongoose.Types.ObjectId;
    db.gfs.files.findOne({ _id: ObjectID(req.params.id) }, function (err, file) {
        if(err) {
            return next(err);
        }
        if(!file) {
            res.status(404);
            return next();
        }
        res.setHeader('Content-disposition', 'attachment; filename=' + file.filename);
        res.setHeader('Content-type', file.contentType);
        var readstream = db.gfs.createReadStream({
            _id: req.params.id
        });
        return readstream.pipe(res);
    });
});

module.exports = router;