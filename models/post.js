var mongodb = require('../models/mongodb');
var Schema = mongodb.mongoose.Schema;

var postSchema = new Schema({
    title: String,
    time: {
        type: Date,
        index: true,
        default: Date.now()
    },
    content: String,
    summary: String,
    tags: [String],
    url: {
        type: String,
        unique: true
    },
    catalog: {
        type: Schema.Types.ObjectId,
        ref: 'catalogs'
    },
    isPage: {
        type: Boolean,
        index: true
    }
});

var posts = mongodb.mongoose.model('posts', postSchema);
module.exports = posts;