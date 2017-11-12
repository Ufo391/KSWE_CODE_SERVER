// dependencies
var express = require('express');

var db = require('./app/model/databaseAPI')

// instances
var app = express();


// attributes
var server_port = 3000;


// functions

var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at http://%s:%s", host, port)

})

// routes

app.get('/login', function (req, res) {
    db.read(req,res);
})