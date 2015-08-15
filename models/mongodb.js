var mongoose = require('mongoose');
mongoose.connect('mongodb://yuuko:123456@hk.1234.sh/yuuko', {
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