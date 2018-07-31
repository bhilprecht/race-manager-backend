module.exports.notifyTeam = function(teamId) {
    console.log("I have to inform "+ teamId);
}

module.exports.notifyDriver = function(notificationId, teamId, eventId, startdate) {
    console.log("I have to notify " + notificationId + " of team " + teamId + " for id " + eventId + " at " + startdate)
}