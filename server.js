// dependencies
var express = require('express');
var upload = require('express-fileupload');

var ip = require('./app/util/ip')

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var User        = require('./app/model/user');

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

})

function initialize(){

  initFilesDir();
  
  initAdress();

}

function initFilesDir(){

  createDir('./files');
  createDir('./files/audio');
  createDir('./files/video');

}

function createDir(_path){

  if(fs.existsSync(_path) === false){
    fs.mkdirSync(_path);

  }

}

function initAdress(){

  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at Port %s", port)
  ip.showServerIP();
}

// routes

apiRoutes.get('/debug',function(req,res){
  res.json({success: true});
})

apiRoutes.post('/upload', function(req,res){
  tokenHandler(req,res,fileT.fromClient);
})

apiRoutes.post('/download', function(req,res){
  tokenHandler(req,res,fileT.toClient);
})

apiRoutes.get('/info', function(req,res){
  tokenHandler(req,res,infoHandler);
})

apiRoutes.post('/signup', function(req, res) {
  User.register(req,res);
 });

apiRoutes.post('/authenticate', function(req, res) {  
  User.login(req,res);
});