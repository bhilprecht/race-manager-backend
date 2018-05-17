var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Person = require('./person');

var StintSchema = new Schema({
    finished : {
        type: Boolean,
        default: false
    },
    isBreak : {
        type: Boolean,
        default: false
    },
    orderNo : {
        type: Number,
        required: true
    },
    driverId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Person'
    },
    raceDay : {
        type: Number,
        default: 1
    },
    startdate : {
        type : Date
    },
    enddate : {
        type : Date
    }
    //TODO: Tags
});

module.exports = StintSchema;