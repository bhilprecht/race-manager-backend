var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var CronJob = require('cron').CronJob;
var notificationRoutine = require('./libs/notificationRoutine');
var cors = require('./libs/corsMiddleware');

var app = express();
module.exports.app = app;
mongoose.Promise = global.Promise;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors);
require('./libs/validationMiddleware');

// connect to mongo database
mongoUrl = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017';
mongoose.connect(mongoUrl).then(function(){
    console.log('Connected to Mongo');
});

// add all routes
require('./routes/heartbeat');
require('./routes/team');
require('./routes/person');
require('./routes/event');
require('./routes/stint');
require('./routes/statistics');

// check for notifications every minute
new CronJob('0 * * * * *', function() {
    notificationRoutine();
}, null, true, 'America/Los_Angeles');

// start server
app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port 3000!');
});