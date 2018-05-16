var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    secret: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Team', TeamSchema);