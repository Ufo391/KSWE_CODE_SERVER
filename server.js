// dependencies
var express = require('express');
var upload = require('express-fileupload');

var ip = require('./app/util/ip')

var url = require('url');
var url_parts = url.parse('/login', true);
var query = url_parts.query;

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var User        = require('./app/model/user'); // get the mongoose model

var db = require('./app/model/databaseAPI');

var fileT = require('./app/com/filetransfer');
var tokenHandler = require('./app/security/tokenHandler');
var infoHandler = require('./app/com/InfoHandler');
var fs = require('fs');

// instances
var app = express();

// attributes
var server_port = 3000;

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// upload
app.use(upload());

// bundle our routes
var apiRoutes = express.Router();
// connect the api routes under /api/*
app.use('/api', apiRoutes);


// Functions

var server = app.listen(server_port, function () {

  initialize();

  console.log("Server listening at Port %s", port)
  ip.showServerIP();

})

function initialize(){

  initFilesDir();
  initAdress();

}

function initFilesDir(){

  var _path = path.dirname(require.main.filename) + '/files/audio/';
  if(fs.existsSync(_path) === false){
    fs.mkdir(_path);
  }

  _path = path.dirname(require.main.filename) + '/files/video/';
  if(fs.existsSync(_path) === false){
    fs.mkdir(_path);
  }

}

function initAdress(){

  var host = server.address().address
  var port = server.address().port

}

// routes

app.get('/debug',function(req,res){
  res.json({success: true});
})

app.post('/upload', function(req,res){
  tokenHandler(req,res,fileT.recive);
})

app.post('/download-video', function(req,res){
  tokenHandler(req,res,fileT.send);
})

app.post('/download-audio', function(req,res){
  tokenHandler(req,res,fileT.send);
})

app.get('/info', function(req,res){
  tokenHandler(req,res,infoHandler);
})
// Erstelle neuen Benutzer (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  User.register(req,res);
 });

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {  
  User.login(req,res);
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', function(req, res) { 
  tokenHandler(req,res,User.getMemberInfo);   
});