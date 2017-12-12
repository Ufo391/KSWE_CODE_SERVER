var fs = require("fs");
var mysql = require("mysql");

secret_token = "SUPERDUPERGEHEIM";

// Database
var table_users = [];
var table_tokens = [];

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

module.exports.create = function (name,password){
        
    var obj = new Object();
    obj.name = name;
    obj.password = password;
    obj.id = table_users.length;
    var str_json = JSON.stringify(obj);

    table_users.push(str_json);
}

module.exports.insertToken = function(user,token){

    var obj = new Object();
    obj.id_user = user.id;
    obj.token = token;
    var str_json = JSON.stringify(obj);

    if(contains(table_tokens,str_json) == false){
        table_tokens.push(str_json);
    }
    else{
        throw "You are already logged in.";
    }    
}

module.exports.findUserById = function(id){ 
        return JSON.parse(table_users[id]);
}

module.exports.findUserByName = function(name){

    for (i in table_users) {
        var user = JSON.parse(table_users[i]);
        if(name.toLowerCase() == user.name.toLowerCase()){
            return user;
        }
    } 

    return null;
}

module.exports.test = function(){
    
    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "starduell123",
        database: "starduell"
      });
      
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        
        con.query("SELECT * FROM Person", function (err, result, fields) {
            if (err) throw err;
            console.log(result);
          });
      });
}