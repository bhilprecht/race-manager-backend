var express = require('express');
var app = express();
module.exports.app = app;
var bodyParser = require('body-parser');

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length");
  next();
});

require('./routes/heartbeat');

app.listen(process.env.PORT || 3000, function(){
    console.log('Listening on port 3000!');
});