var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
var notificationRoutine = require('./libs/notificationRoutine');

var app = express();
module.exports.app = app;
mongoose.Promise = global.Promise;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

mongoUrl = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017';

mongoose.connect(mongoUrl).then(function(){
    console.log('Connected to Mongo');
});

require('./routes/heartbeat');
require('./routes/team');
require('./routes/person');
require('./routes/event');
require('./routes/stint');
require('./routes/statistics');

//Job runs every minute
new CronJob('0 * * * * *', function() {
    notificationRoutine();
    console.log('notificationRoutine() executed');
}, null, true, 'America/Los_Angeles');
notificationRoutine();

app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port 3000!');
});