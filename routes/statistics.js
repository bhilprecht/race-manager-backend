var mongoose = require('mongoose'),
    app = require('../index').app,
    Team = require("../models/team"),
    async = require("async");

app.get('/team/:teamId/event/:eventId/driver_stats', function(req, res){

    //finished is true by default!
    var is_finished_not_false = !(req.query.finished == 'false');

    Team.aggregate([ 
        { $match : { "_id": mongoose.mongo.ObjectId(req.params.teamId) } },
        { $unwind : "$events"},
        { $match : { "events._id": mongoose.mongo.ObjectId(req.params.eventId) } },
        { $unwind : "$events.stints"},
        { $match : { "events.stints.finished": is_finished_not_false,
                     "events.stints.isBreak": false } },
        { $addFields: { 
            "events.stints.timespan": {$subtract: ["$events.stints.enddate","$events.stints.startdate"]},
            "events.stints.count": 1 } },
        { $group : { _id: "$events.stints.driverId", 
                    totalStints: { $sum : "$events.stints.count" },
                    totalDrivingTime: { $sum : "$events.stints.timespan" }, } }
    ],function (err, result) {
        if (err)
            return res.status(400).send(err);

        Team.findById(req.params.teamId, function(err, team) {
            
            //populate drivers
            async.forEach(result,function(result_row,callback) {
                console.log(result_row)
                result_row.driver = team.members.id(result_row._id)
                result_row._id = undefined
            }, function(err) {});
            res.json(result);
        });
    })
    
});