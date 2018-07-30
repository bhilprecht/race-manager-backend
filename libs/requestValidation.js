var constants = require('./constants'),
    Team = require("../models/team");

// check that team exists
module.exports.checkTeam = function (req, res, next) {
    Team.findById(req.params.teamId, function(err, team) {
        
        if (err || !team)
            return res.status(400).send({message: 'Error: Team not found'});

        req.team = team
        next();
    });
}

// we do not require team member id if user is created because he might not have one
module.exports.checkMemberIdRequired = function(req, res, next) {
    if (req.method == 'OPTIONS')
        req.teamMemberIdNotRequired = true;
    next();
}

// we do not require team member id if user is created because he might not have one
module.exports.teamMemberIdNotRequired = function(req, res, next) {
    req.teamMemberIdNotRequired = true;
    next();
}

// Todo: security: check that member belongs to team or is admin
module.exports.checkMember = function (req, res, next) {
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
}

    
