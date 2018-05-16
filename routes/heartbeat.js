app = require('../index').app

app.get('/heartbeat', function(req, res){
    //res.json(exceptions);
    res.send('Hello World!');
});