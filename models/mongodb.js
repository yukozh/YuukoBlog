var mongoose = require('mongoose');
mongoose.connect('mongodb://yuuko:123456@localhost/yuuko', {
    server: {
        auto_reconnect: true,
        socketOptions:{
            keepAlive: 1
        }
    },
    db: {
        numberOfRetries: 3,
        retryMiliSeconds: 1000,
        safe: true
    }
});
exports.mongoose = mongoose;