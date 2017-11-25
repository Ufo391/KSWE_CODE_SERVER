var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');


// Login/Register

function register(name,password){
   
    var result_flag = true;

    if(db.findUser(name) == null){        
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                console.log(err);
            }            
            db.create(name,hash);            
        });  
    }
    else{
        result_flag = false;
    }

    return result_flag;           
}

function login(name, password){

    var user = db.findUser(name);

    if(user != null){
        
        compare(password,user.password, function (err, isMatch) {
          
            if (isMatch && !err) {
            
            var token = jwt.encode(name, secret_token);
            db.insertToken(name,token);
            return json({success: true, msg: 'JWT ' + token});
          
        } else {            
            return json({success: false, msg: 'Authentication failed. Wrong password.'});
          
        }
        });
    }
    else{
        
        return json({success: false, msg: 'User not found.'});
      
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