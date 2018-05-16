var mongoose = require('mongoose');
var Person = require('./person');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{type: Person}]
});

module.exports = mongoose.model('Team', TeamSchema);