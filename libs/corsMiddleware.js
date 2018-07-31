constants = require("./constants");

module.exports = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, Access-Control-Request-Method, Access-Control-Request-Headers, " + constants.HEADER_TEAM_MEMBER_ID);
    res.header('Access-Control-Allow-Methods', 'HEAD, PUT, POST, GET, DELETE, OPTIONS');
    next();
}