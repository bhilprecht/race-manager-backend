
var mongoose = require('mongoose'),
    app = require('../index').app,
    Team = require("../models/team"),
    Person = mongoose.model('Person', require("../models/person"));

app.post('/team/:teamId/person', function(req, res){

    if(!req.body.name || !req.body.color)
        return res.status(400).send({ message: 'Error: name and color are mandatory fields' });

    if(req.body.driver && req.body.connectedViaDevice && !req.body.minutesBeforeNotification)
        return res.status(400).send({ message: 'Error: minutesBeforeNotification is mandatory for drivers which are connected via their device' });

    Team.findById(req.params.teamId, function(err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        var person = new Person();

        person.name = req.body.name;
        if (req.body.minutesBeforeNotification) { person.minutesBeforeNotification = req.body.minutesBeforeNotification }
        if (req.body.weight) { person.weight = req.body.weight }

        person.driver = req.body.driver;
        person.connectedViaDevice = req.body.connectedViaDevice;
        person.avatarNo = req.body.avatarNo || Math.floor(Math.random() * 8);
        person.color = req.body.color;
        person.active = true;

        team.members.push(person);

        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(person);
        });
    });
});

app.delete('/team/:teamId/person/:personId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        if (!team.members.id(req.params.personId))
            return res.status(400).send({message: 'Error: Person not found'});

        team.members.id(req.params.personId).remove();
        team.save();   
        res.json({ message: 'person deleted!' });         
    });
});

app.get('/team/:teamId/person', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});
        
        members = team.members

        if (req.query.driver == 'true')
            members = members.filter(function(person){return person.driver})
        else if (req.query.driver == 'false')
            members = members.filter(function(person){return !person.driver})

        if (req.query.active == 'true')
            members = members.filter(function(person){return person.active})
        else if (req.query.active == 'false')
            members = members.filter(function(person){return !person.active})

        if (req.query.connectedViaDevice == 'true')
            members = members.filter(function(person){return person.connectedViaDevice})
        else if (req.query.connectedViaDevice == 'false')
            members = members.filter(function(person){return !person.connectedViaDevice})
            
        res.json(members);    
    });
});

app.get('/team/:teamId/person/:personId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        res.json(team.members.id(req.params.personId));         
    });
});

app.put('/team/:teamId/person/:personId', function(req, res){
    Team.findById(req.params.teamId, function (err, team) {
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        person = team.members.id(req.params.personId)

        if (!person)
            return res.status(400).send({message: 'Error: Person not found'});

        if(req.body.driver && !person.driver &&
            (req.body.connectedViaDevice || person.connectedViaDevice) && 
            !req.body.minutesBeforeNotification)
            return res.status(400).send({ message: 'Error: minutesBeforeNotification is mandatory for drivers which are connected via their device' });

        if(req.body.name) { person.name = req.body.name }
        if(req.body.minutesBeforeNotification) { person.minutesBeforeNotification = req.body.minutesBeforeNotification }
        if(req.body.notificationId) { person.notificationId = req.body.notificationId }
        if(req.body.driver != undefined) { person.driver = req.body.driver }
        if(req.body.connectedViaDevice != undefined) { person.connectedViaDevice = req.body.connectedViaDevice }
        if(req.body.color) { person.color = req.body.color }
        if(req.body.avatarNo) { person.avatarNo = req.body.avatarNo }
        if (req.body.weight) { person.weight = req.body.weight }
        if (req.body.active) { person.active = req.body.active }

        team.save(function(err) {
            if (err)
                return res.status(400).send(err);
            res.json(person);
        });  

        //res.json(person);         
    });
});