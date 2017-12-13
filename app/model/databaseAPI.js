var fs = require("fs");
var mysql = require("mysql");

secret_token = "SUPERDUPERGEHEIM";

// Connection
var connection_info = {
    host: "localhost",
    user: "root",
    password: "starduell123",
    database: "starduell"
  };

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

module.exports.createUser = function (name,password,email,response, res){

    createUserQuery();
    
}

function createUserQuery(){

    query("insert into Person values ('" + name + "','" + password + "','" + email + "', 0);",function(result){
        
        response(true,"User created.",res);
        
    });

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

module.exports.findUserByName = function(name){
        
}

function query(command,callback){
    
    var con = mysql.createConnection(connection_info);
            
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        
        con.query(command, function (err, result, fields) {
            if (err){
                con.end();
                throw err;
            } 
            callback(result);
            con.end();
        });
    });
}