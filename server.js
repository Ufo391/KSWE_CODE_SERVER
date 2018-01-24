// dependencies
var express = require('express');
var upload = require('express-fileupload');

var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var user        = require('./app/model/user');
var db = require('./app/model/databaseAPI');
var fileT = require('./app/com/filetransfer');
var tokenHandler = require('./app/security/tokenHandler');
var infoHandler = require('./app/com/InfoHandler');
var ip = require('./app/util/ip')

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


// functions

var server = app.listen(server_port, function () {

  fileT.initialize();
  ip.initialize(server);

})

// routes

apiRoutes.get('/playback', function(req,res){
  // Route zum abspielen eines Videos (clicks inkrementieren nicht vergessen) / Instrumentals
})

apiRoutes.post('/upload', function(req,res){
  tokenHandler(req,res,fileT.fromClient);
})

apiRoutes.get('/download', function(req,res){
  tokenHandler(req,res,fileT.toClient);
})

apiRoutes.get('/info', function(req,res){
  tokenHandler(req,res,infoHandler);
})

apiRoutes.post('/session', function(req,res){
  tokenHandler(req,res,db.createSession);
})

apiRoutes.post('/signup', function(req, res) {
  user.register(req,res);
 });

apiRoutes.get('/authenticate', function(req, res) {  
  user.login(req,res);
});

apiRoutes.post('/follow', function(req, res) {  
  tokenHandler(req,res,user.addFollower);
});

apiRoutes.post('/comment', function(req,res){
  tokenHandler(req,res,db.createComment);
})

// ACHTING: Änderung in DB einpflegen --> Table Like hat keine Primärschlüssel --> zusammengesetzten machen!!
apiRoutes.post('/like', function(req,res){
  tokenHandler(req,res,db.createLike);
})