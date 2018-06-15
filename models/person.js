var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PersonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    minutesBeforeNotification: {
        type: Number,
        min: 0
    },
    notificationId: {
        type: String
    },
    driver: {
        type: Boolean,
        required: true
    }, 
    connectedViaDevice: {
        type: Boolean,
        required: true
    },
    color: { 
        type: Number,
        required: true
    },
    avatarNo: {
        type: Number,
        required: true
    },
    weight: {
       type: Number 
    }
});

module.exports = PersonSchema;
