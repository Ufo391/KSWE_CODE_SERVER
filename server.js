// dependencies
var express = require('express');
var db = require('./app/model/databaseAPI')
var url = require('url');
var ip = require('./app/util/ip')
var account = require('./app/model/account');
var url_parts = url.parse('/login', true);
var query = url_parts.query;

// instances
var app = express();

// attributes
var server_port = 3000;


// functions

var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at http://%s:%s", host, port)
  ip.showServerIP();

})

// routes

app.get('/login', function (req, res) {      
  res.send(account.login(req.query.id,req.query.password));
})

