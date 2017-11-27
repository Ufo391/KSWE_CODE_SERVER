var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');
var jwt = require('jwt-simple');

// Dummy User
dummy_user_name = "Hans";
dummy_user_passwort = "Wurst";
dummy_user_token = "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.MA.b8XGZfo0xMRp_dwU640jBAVYRL47ul-qXS3CEestCsM";
// Füge DummyUser in DB ein
function insertDummyUser(){
    bcrypt.hash(dummy_user_passwort, 10, function (err, hash) {
        if (err) {
            console.log(err);
        }            
        db.create(dummy_user_name,hash);  
    });  
}


// Login/Register

function register(req,res){

    if (!req.body.name || !req.body.password) { res.json({success: false, msg: 'Please pass Name and Password.'});} 
    else 
    {       
        var name = req.body.name;
        var password = req.body.password;

        if(db.findUserByName(name) == null){        
            bcrypt.hash(password, 10, function (err, hash) {
                if (err) {
                    console.log(err);
                }            
                db.create(name,hash);  
                res.json({success: true, msg: 'User created.'});
            });  
        }
        else{
            res.json({success: false, msg: 'Name is assigned.'});
        }                                           
    }
}

function login(req,res){

    var name = req.body.name;
    var password = req.body.password;

    var user = db.findUserByName(name);

    if(user != null){
        
        compare(password,user.password, function (err, isMatch) {
          
            if (isMatch && !err) {
            var token = jwt.encode(user.id, secret_token);
            try{
                // Damit kein Doppeleintrag in der Database entsteht            
                db.insertToken(user,token);                                        
            }
            catch(ex){}
            res.json({success: true, msg: 'JWT ' + token});
          
        } else {            
            res.json({success: false, msg: 'Authentication failed. Wrong password.'});
          
        }
        });
    }
    else{        
        res.json({success: false, msg: 'User not found.'});      
    }  

}

function getMemberInfo(req,res){

    var token = getToken(req.headers);
    if (token) {
      var decoded = parseInt(jwt.decode(token, secret_token));  
      try{      
        var user = db.findUserById(decoded); 
      }
      catch(ex){
        res.json({success: false, msg: 'Authentication failed. User not found.'});
      }     
      if(user != undefined)
      {
        res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
      }
      else
      {
        res.json({success: false, msg: 'Authentication failed. User not found.'});
      }
    } 
    else 
    {
      res.json({success: false, msg: 'No token provided.'});
    }

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
module.exports.insertDummyUser = insertDummyUser;