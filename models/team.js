var mongoose = require('mongoose');
var Person = require('./person');
var Event = require('./event');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{type: Person}],
    events: [{type: Event}]
});

module.exports = mongoose.model('Team', TeamSchema);