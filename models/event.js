var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Stint = require('./stint');

var EventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startdate: {
        type: Date,
        min: 0,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    noRaceDays: {
        type: Number,
        required: true
    },
    picturePath: {
        type: String
    },
    stints : [{type : Stint}]
});

module.exports = EventSchema;
