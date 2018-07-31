var app = require('../index').app,
    Team = require("../models/team"),
    constants = require("./constants");

// middleware to validate correct teamId
app.use('/team/:teamId', function (req, res, next) {
    Team.findById(req.params.teamId, function(err, team) {
        
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        req.team = team
        next();
    });
});

// memberId not required if post against person because might not be available
app.post('/team/:teamId/person', function(req, res, next) {
    req.teamMemberIdNotRequired = true;
    next();
})

//Options is always allowed
app.use(function(req, res, next) {
    if (req.method == 'OPTIONS')
        req.teamMemberIdNotRequired = true;
    next();
});

// Todo: security: check that member belongs to team or is admin
//check if memberId is valid if required
app.use('/team/:teamId', function (req, res, next) {
    //check if member id is required
    if(req.teamMemberIdNotRequired) {
        return next()
    }

    var personId = req.get(constants.HEADER_TEAM_MEMBER_ID)
    if (!personId) {
        return res.status(400).send({message: 'Please provide header ' + constants.HEADER_TEAM_MEMBER_ID});
    }
    
    var member = req.team.members.id(personId)
    if (!member) {
        return res.status(400).send({message: 'MemberId does not exist'});
    }
    if (member.active != true) {
        return res.status(400).send({message: 'MemberId is not active'});
    }    
    next();
});