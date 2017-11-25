// dependencies
var express = require('express');

var ip = require('./app/util/ip')

var url = require('url');
var url_parts = url.parse('/login', true);
var query = url_parts.query;

var db = require('./app/model/databaseAPI');

var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var User        = require('./app/model/user'); // get the mongoose model
var jwt         = require('jwt-simple');


// instances
var app = express();

// attributes
var server_port = 3000;

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// bundle our routes
var apiRoutes = express.Router();
// connect the api routes under /api/*
app.use('/api', apiRoutes);


// Functions

var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at Port %s", port)
  ip.showServerIP();

  //debug();

})

// routes

function debug(){

}

function debug_db(res){
  var str = "Name: " + db_name + " | Passwort: " + db_password;
  console.log(str);
  res.send(str);
}

app.get('/debug',function(req,res){
  debug_db(res);
})

app.get('/debug1',function(req,res){  
  res.send("");
})

// User registrieren

// Erstelle neuen Benutzer (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) { res.json({success: false, msg: 'Please pass Name and Password.'});} 
  else 
  {           
    if(User.register(req.body.name,req.body.password) == true){
      res.json({success: true, msg: 'User created.'});
    }
    else{
      res.json({success: false, msg: 'Name is assigned.'});
    }    
  }
 });


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  res.json(User.login(name,password));

  if(req.body.name == db_name){
    // check if password matches
    User.compare(req.body.password,db_password, function (err, isMatch) {
      if (isMatch && !err) {
        var token = jwt.encode(db_name, secret_token);

        db_token = token;
        res.json({success: true, msg: 'JWT ' + token});
      } else {
        res.send({success: false, msg: 'Authentication failed. Wrong password.'});
      }
    });
  }else{
    res.send({success: false, msg: 'User not found.'});
  }  
});

// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', function(req, res) {  

  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, secret_token);
    var user_name = decoded;

    if(user_name == db_name)
    {
      res.json({success: true, msg: 'Welcome in the member area ' + db_name + '!'});
    }
    else
    {
      return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
    }
  } 
  else 
  {
    return res.status(403).send({success: false, msg: 'No token provided.'});
  }
});
 
getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};