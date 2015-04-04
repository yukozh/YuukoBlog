var mongodb = require('../models/mongodb');
var Schema = mongodb.mongoose.Schema;

var catalogSchema = new Schema({
    title: {
        type: String,
        index: true
    },
    title_zh: String,
    order: {
        type: Number,
        index: true
    }
});

var posts = mongodb.mongoose.model('catalogs', catalogSchema);
module.exports = posts;