var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
module.exports.app = app;
mongoose.Promise = global.Promise;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
  next();
});

mongoUrl = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017';

mongoose.connect(mongoUrl).then(function(){
    console.log('Connected to Mongo');
});

require('./routes/heartbeat');
require('./routes/team');
require('./routes/person');

app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port 3000!');
});