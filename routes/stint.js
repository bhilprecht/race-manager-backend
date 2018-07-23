var mongoose = require('mongoose'),
    app = require('../index').app,
    Team = require("../models/team"),
    Stint = mongoose.model('Stint', require("../models/stint")),
    async = require("async");

var correctOrderNos = function(stints) {
    for(var i=0;i<stints.length;i++){
        stint = stints[i];
        stint.orderNo = i+1;
    }
    return stints;
}

var computeNotificationTime = function(stint, team) {
    var driver = team.members.id(stint.driverId)
    var minutesBeforeNotification = 10 //Default
    if (driver)
        minutesBeforeNotification = driver.minutesBeforeNotification
    return new Date(stint.startdate.getTime() - minutesBeforeNotification*60000)
}

app.post('/team/:teamId/event/:eventId/stint', function(req, res){

    if(req.body.orderNo)
        return res.status(400).send({ message: 'Error: orderNo is calculated automatically. By default stint is last stint.' });

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = new Stint();

        if (req.body.finished != undefined) { stint.finished = req.body.finished }
        if (req.body.isBreak != undefined) { stint.isBreak = req.body.isBreak }
        if (req.body.driverId) {stint.driverId = req.body.driverId }
        if (req.body.raceDay) {stint.raceDay = req.body.raceDay }
        if (req.body.startdate) {stint.startdate = req.body.startdate }
        if (req.body.enddate) {stint.enddate = req.body.enddate }
        if (req.body.tags) {stint.tags = req.body.tags }

        stint.notified = false
        stint.notificationTime = computeNotificationTime(stint, team)
       
        // by default, last position
        stint.orderNo = event.stints.length + 1

        event.stints.push(stint);

        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(stint);
        });
    });
});

app.get('/team/:teamId/event/:eventId/stint/:stintId', function(req, res){

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = event.stints.id(req.params.stintId)
        if (!stint)
            return res.status(400).send({message: 'Error: Stint not found'});

        stint = stint.toObject();
        
        //populate driver
        stint.driver = team.members.id(stint.driverId)
        stint.driverId = undefined

        res.json(stint);
    });
    
});

app.get('/team/:teamId/event/:eventId/stint', function(req, res){

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stints = event.stints.toObject();

        if (req.query.finished == 'true')
            stints = stints.filter(function(stint){return stint.finished})
        else if (req.query.finished == 'false')
            stints = stints.filter(function(stint){return !stint.finished})

        //populate drivers
        async.forEach(stints,function(stint,callback) {
            console.log(stint)
            stint.driver = team.members.id(stint.driverId)
            stint.driverId = undefined
        }, function(err) {
            //ignored
        });
        res.json(stints);
    });
    
});

app.delete('/team/:teamId/event/:eventId/stint/:stintId', function(req, res){

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = event.stints.id(req.params.stintId)
        if (!stint)
            return res.status(400).send({message: 'Error: Stint not found'});

        stint.remove();
        //correct OrderNo
        event.stints = correctOrderNos(event.stints);

        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
                res.json({ message: 'deleted' });
        });
    });
    
});

app.put('/team/:teamId/event/:eventId/stint/:stintId', function(req, res){

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = event.stints.id(req.params.stintId)
        if (!stint)
            return res.status(400).send({message: 'Error: Stint not found'});

        if (req.body.finished != undefined) { stint.finished = req.body.finished }
        if (req.body.isBreak != undefined) { stint.isBreak = req.body.isBreak }
        if (req.body.driverId && req.body.driverId != stint.driverId) {
            stint.notificationTime = computeNotificationTime(stint, team)
            stint.driverId = req.body.driverId 
            stint.notified = false //if you change the driver, notification should be renewed
        }
        if (req.body.raceDay) {stint.raceDay = req.body.raceDay }
        if (req.body.startdate && req.body.startdate != stint.startdate) {
            stint.notificationTime = computeNotificationTime(stint, team)
            stint.startdate = req.body.startdate
            stint.notified = false //if you change the time, notification should be renewed
        }
        if (req.body.enddate) {stint.enddate = req.body.enddate }
        if (req.body.notified  != undefined) {stint.notified = req.body.notified }
        if (req.body.tags) {stint.tags = req.body.tags }

        if (req.body.orderNo != undefined) { 

            orderNo = parseInt(req.body.orderNo);
            console.log(orderNo);
            console.log(typeof orderNo);

            //is desired position valid?
            if (orderNo < 1)
                return res.status(400).send({message: 'Error: Desired OrderNo cannot be smaller than 1.'});
            if (orderNo > event.stints.length)
                return res.status(400).send({message: 'Error: Desired OrderNo out of bounds.'});
            
            //move stint to desired position
            fromIndex = event.stints.indexOf(stint);
            toIndex = orderNo-1;

            event.stints.splice(fromIndex, 1);
            event.stints.splice(toIndex, 0, stint);
            
            //correct OrderNo
            event.stints = correctOrderNos(event.stints);
        }

        // save stint
        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(stint);
        });
    });
});