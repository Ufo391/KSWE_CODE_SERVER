var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');
var jwt = require('jwt-simple');

// Login/Register

function register(req,res){

    if (!req.body.name || !req.body.password) { res.json({success: false, msg: 'Please pass Name and Password.'});} 
    else 
    {       
        var name = req.body.name;
        var password = req.body.password;

        if(db.findUser(name) == null){        
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

    var user = db.findUser(name);

    if(user != null){
        
        compare(password,user.password, function (err, isMatch) {
          
            if (isMatch && !err) {
            
            var token = jwt.encode(name, secret_token);
            db.insertToken(name,token);            
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

function getMemberInfo(){

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

module.exports.register = register;
module.exports.compare = compare;
module.exports.login = login;