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

    var _query = "";
    if(email === undefined){
        _query = "insert into Person values ('" + name + "','" + password + "','NULL', 0);";
    }
    else{
        _query = "insert into Person values ('" + name + "','" + password + "','" + email + "', 0);";
    }

    query(_query,function(result){
        
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

module.exports.findUserByName = function(name, callback){
        var _query = "select * from Person where username = '" + name + "';";        
        query(_query,callback);
}

function query (command,callback){
    
    var con = mysql.createConnection(connection_info);    

    con.connect(function(err) {
        if (err) throw err;        
        
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

module.exports.query = query;

module.exports.qResultToJSON = qResultToJSON;

function qResultToJSON(q_result){
    return JSON.parse(JSON.stringify(q_result[0]));
}

module.exports.createSession = function(req,res,creator_username){

    var topic = req.body.topic;
    var type = req.body.type;
    var participant = req.body.participant;
    var _query = "";
    var date = new Date().toISOString().slice(0,19).replace('T',' ');

    

    if(topic === undefined || type === undefined){
        res.json({success: false, msg: 'missing topic or type!'});
        return;
    }

    if(participant === undefined){
        res.json({success: false, msg: 'missing participant!'});
        return;
    }

    // Session anlegen
    _query = "insert into Session (date,creator_username,topic_name,type_name) values ('" + date + "','" + creator_username + "','" + topic + "','" + type + "');";
    
    query(_query,function(){

        // id der Session holen
        _query = "Select id From Session where date = '" + date + "'";        
        query(_query,function(result){

            var db_result = qResultToJSON(result);

            _query = "insert into Person_Session (participant_username, session_id, accepted) values ('" + participant + "'," + db_result.id + ","  + 0 + ");"; 
            query(_query,function(){                
                res.json({success: true, msg: 'Session successfully created!', id: db_result.id});
            });            

        });

    });    

}

module.exports.insertContent = function(username,filepath, name, duration){

}