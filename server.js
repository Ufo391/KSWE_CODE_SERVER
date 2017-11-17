// dependencies
var express = require('express');

var ip = require('./app/util/ip')
var account = require('./app/model/account');

var url = require('url');
var url_parts = url.parse('/login', true);
var query = url_parts.query;

var db = require('./app/model/databaseAPI');


var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var passport	= require('passport');
var config      = require('./app/config/database'); // get db config file
var User        = require('./app/model/user'); // get the mongoose model
var jwt         = require('jwt-simple');


// instances
var app = express();

// attributes
var server_port = 3000;


// functions

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// log to console
app.use(morgan('dev'));

// Use the passport package in our application
app.use(passport.initialize());

var server = app.listen(server_port, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Server listening at Port %s", port)
  ip.showServerIP();

  test_run();

})

// routes

app.get('/login', function (req, res) {      
  res.send(account.login(req.query.id,req.query.password));
})



function test_run(){

}

// User registrieren

// connect to database
mongoose.connect(config.database);

// pass passport for configuration
require('./app/config/passport')(passport);

// bundle our routes
var apiRoutes = express.Router();


// Erstelle neuen Benutzer (POST http://localhost:8080/api/signup)
apiRoutes.post('/signup', function(req, res) {
 if (!req.body.name || !req.body.password) {
   res.json({success: false, msg: 'Please pass name and password.'});
 } else {
    var name = req.body.name;
    var password = req.body.password;    
    var hash = User.hash(password);     
    db.insert();


    res.json({success: true, msg: 'Successful created new user.'});     
 }
});

/*
apiRoutes.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
 });
*/



// connect the api routes under /api/*
app.use('/api', apiRoutes);




// User Auth with JSON WebToken

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
          // if user is found and password is right create a token
          var token = jwt.encode(user, config.secret);
          // return the information including token as JSON
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});





// route to a restricted info (GET http://localhost:8080/api/memberinfo)
apiRoutes.get('/memberinfo', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, config.secret);
    User.findOne({
      name: decoded.name
    }, function(err, user) {
        if (err) throw err;
 
        if (!user) {
          return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
          res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
        }
    });
  } else {
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