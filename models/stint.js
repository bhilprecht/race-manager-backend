var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
    }, 
    notified : {
        type : Boolean,
        default: false
    },
    notificationTime : {
        type : Date
    },
    tags: [{
        type: String
    }]
});

module.exports = StintSchema;