var Team = require("../models/team"),
    async = require("async"),
    notificationSender = require("./notificationSender");

var notify = function(result_row) {
    //populate driver
    if(result_row.events.stints.driverId)
        result_row.driver = result_row.members.find(member => member._id == result_row.events.stints.driverId.toHexString())

    if (!result_row.driver) {
        console.log("Could not find driver for stint " + result_row.stint)
    } else if (!result_row.driver.connectedViaDevice || !result_row.driver.notificationId) {
        console.log("Could not notify " + result_row.driver.name)
    } else {
        //do notify
        console.log("notifyDriver")
        notificationSender.notifyDriver(result_row.driver.notificationId, result_row._id, result_row.events._id, result_row.events.stints.startdate) 
    }
    //set notified = true
    Team.findById(result_row._id, function(err, team) {
        //due to parallelism some ids could be deleted
        try { 
            event = team.events.id(result_row.events._id)
            var stint = event.stints.id(result_row.events.stints._id)

            stint.notified = true

            team.save(function(err) {
                if (err)
                    console.log(err)
            });
        }
        catch(err) {
            console.log(err)
        }
    });
}

// Check stints with due notification
var notificationRoutine = function() {
    //new Date("2018-06-17T10:00:00") for testing
    var now = new Date();

    Team.aggregate([ 
        { $unwind : "$events"},
        { $unwind : "$events.stints"},
        { $match : { "events.stints.notificationTime" : { $lte : now },
                     "events.stints.isBreak" : false,
                     "events.stints.finished" : false,
                     "events.stints.notified" : false } }
    ],function (err, result) {
        async.forEach(result,notify);
    })
}

module.exports = notificationRoutine