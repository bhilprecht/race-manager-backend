var mongoose = require('mongoose'),
    app = require('../index').app,
    Team = require("../models/team"),
    Event = mongoose.model('Event', require("../models/event")),
    Stint = mongoose.model('Stint', require("../models/stint")),
    Person = mongoose.model('Person', require("../models/person")),
    async = require("async");

app.post('/team/:teamId/event/:eventId/stint', function(req, res){

    if(!req.body.orderNo)
        return res.status(400).send({ message: 'Error: orderNo is mandatory field' });

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = new Stint();

        stint.orderNo = req.body.orderNo;
        if (req.body.finished != undefined) { stint.finished = req.body.finished }
        if (req.body.isBreak != undefined) { stint.isBreak = req.body.isBreak }
        if (req.body.driverId) {stint.driverId = req.body.driverId }
        if (req.body.raceDay) {stint.raceDay = req.body.raceDay }
        if (req.body.startdate) {stint.startdate = req.body.startdate }
        if (req.body.enddate) {stint.enddate = req.body.enddate }

        event.stints.push(stint);

        // save the comment
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
        team.save();   
        res.json({ message: 'deleted' });
    });
    
});

app.put('/team/:teamId/event/:eventId/stint/:stintId', function(req, res){

    if(!req.body.orderNo)
        return res.status(400).send({ message: 'Error: orderNo is mandatory field' });

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        event = team.events.id(req.params.eventId)
        if (!event)
            return res.status(400).send({message: 'Error: Event not found'});

        var stint = event.stints.id(req.params.stintId)
        if (!stint)
            return res.status(400).send({message: 'Error: Stint not found'});

        if (req.body.orderNo) { stint.orderNo = req.body.orderNo }
        if (req.body.finished != undefined) { stint.finished = req.body.finished }
        if (req.body.isBreak != undefined) { stint.isBreak = req.body.isBreak }
        if (req.body.driverId) {stint.driverId = req.body.driverId }
        if (req.body.raceDay) {stint.raceDay = req.body.raceDay }
        if (req.body.startdate) {stint.startdate = req.body.startdate }
        if (req.body.enddate) {stint.enddate = req.body.enddate }

        // save the comment
        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(stint);
        });
    });
});