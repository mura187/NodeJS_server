var mongoose = require('mongoose');

var state = {
    db: null
};

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connect = connect;
exports.get = get;
function connect(url, done) {
    if (state.db) {
        return done();
    }
 
    mongoose.connect(url, function (err, db) {
        if (err) {
            return done(err);
        }
        state.db = db.db('api');
        done();
    });
}

function get() {
    return state.db;
}