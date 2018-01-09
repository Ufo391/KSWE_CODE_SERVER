var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');
var jwt = require('jwt-simple');

// Login/Register

function register(req,res){

    if (!req.body.name || !req.body.password ) { res.json({success: false, msg: 'Please pass Name, Password and EMail.'});} 
    else 
    {       
        var name = req.body.name;
        var password = req.body.password;
        var email = req.body.email;

        db.findUserByName(name,function(result){

            if(JSON.stringify(result.length) == 0){
                bcrypt.hash(password, 10, function (err, hash) {
                    if (err) {
                        console.log(err);
                    }            
                    db.createUser(name,hash,email,response,res);  
                });  
            }
            else{
                res.json({success: false, msg: 'Name is assigned.'});
            }
        });                                          
    }
}

function login(req,res){

    var name = req.body.name;
    var password = req.body.password;

    db.findUserByName(name,function(result){

        if(result.length == 1){

            var user = db.qResultToJSON(result);

            compare(password,user.password, function (err, isMatch) {
                
                if (isMatch && !err) {
                var token = jwt.encode({
                    username: name,
                    time: new Date().toISOString()
                }, secret_token);                
                res.json({success: true, msg: 'JWT ' + token});                
                } else {            
                  res.json({success: false, msg: 'Authentication failed. Wrong password.'});                
                }
            });                         
        }
        else{
            res.json({success: false, msg: 'User not found.'});   
        }

    });
}

function getMemberInfo(req,res){

    var token = getToken(req.headers);
    
    if (token) {
      var decoded_token = jwt.decode(token, secret_token);
      db.findUserByName(decoded_token.username,function(result){
        if(result.length > 0)
        {
            var user = db.qResultToJSON(result);
            res.json({success: true, msg: 'Welcome: ' + user.username + " with E-Mail: " + user.email});
        }
        else
        {
            res.json({success: false, msg: 'unexpected token'});
        }
      });
    } 
    else 
    {
      res.json({success: false, msg: 'No token provided.'});
    }
}

function response(flag_result,message, resp){
    resp.json({success: flag_result, msg: message});
}

// Security

function compare(input,hash, cb) {
    bcrypt.compare(input, hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

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

module.exports.register = register;
module.exports.compare = compare;
module.exports.login = login;
module.exports.getMemberInfo = getMemberInfo;