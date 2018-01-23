var mysql = require("mysql");

secret_token = "SUPERDUPERGEHEIM";

// Connection
var connection_info = {
    host: "localhost",
    user: "root",
    password: "starduell123",
    database: "starduell"
  };

function execute(command,callback){
    
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

function infoRoute(_query,res){

    execute(_query,function(result){
        if(result.length === 0){
            res.json({success: true, msg: 'no database entry found'}); 
        }else{            
            res.json({success: true, msg: result}); 
        }    
    });

}

function getLastNumericID(tablename,callback){
    _query = "SELECT * FROM " + tablename + " ORDER BY id DESC LIMIT 0, 1";
    
    execute(_query,function(result){
        callback(qResultToJSON(result).id);
    })
}


module.exports.createUser = function (name,password,email,response, res){

    var _query = "";
    if(email === undefined){
        _query = "insert into Person values ('" + name + "','" + password + "','NULL', 0);";
    }
    else{
        _query = "insert into Person values ('" + name + "','" + password + "','" + email + "', 0);";
    }

    execute(_query,function(result){
        
        response(true,"User created.",res);
        
    });
    
}

module.exports.findUserByName = function(name, callback){
        var _query = "select * from Person where username = '" + name + "';";        
        execute(_query,callback);
}

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
    
    execute(_query,function(){

        getLastNumericID("Session",function(result_id){

            _query = "insert into Person_Session (participant_username, session_id, accepted) values ('" + participant + "'," + result_id + ","  + 0 + ");"; 
            execute(_query,function(){                
                res.json({success: true, msg: 'Session successfully created!', id: result_id});
            });  

        });
    });    

}

module.exports.addFollower = function(res, followable_username, follower_username){

    var _query = "insert into Follow_Person (followable_username,follower_username) values ('" + followable_username + "','" + follower_username + "');";
    try{
        execute(_query,function(){
            
            res.json({success: true, msg: follower_username + ' follows ' + followable_username});
    
        });
    }
    catch(e){
        res.json({success: false, msg: e});
    }    

}

module.exports.createComment = function(req,res,username){

    var message = req.body.message;
    var session_id = req.body.session_id;
    var date = new Date().toISOString().slice(0,19).replace('T',' ');

    if(message === undefined || session_id === undefined){
        res.json({success: false, msg: 'Invalid Header! --> message:' + message + " & session_id: " + session_id}); 
        return;
    }

    var _query = "Insert into Comment (creator_username,session_id,message, date) values ('" + username + "'," + session_id + ",'" + message + "','" + date + "');";

    execute(_query,function(){

        getLastNumericID("Comment",function(result_id){

            res.json({success: true, msg: 'Successfully created comment!', id: result_id}); 

        });
    });

}



// show:all

module.exports.getAllGenre = function(res){
   
    var _query = "SELECT * FROM Genre;";
    infoRoute(_query,res);

}

module.exports.getAllInstrumental = function(res){
    
     var _query = "SELECT * FROM Instrumental;";
     infoRoute(_query,res); 

 }

 module.exports.getAllTopic = function(res){
    
     var _query = "SELECT * FROM Topic;";
     infoRoute(_query,res); 
        
 }

 module.exports.getAllType = function(res){
    
     var _query = "SELECT * FROM Type;";    
     infoRoute(_query,res);
     
 }

 module.exports.getAllSession = function(res){
    
    _query = "select Session.id, Session.date, Session.creator_username, Session.topic_name, Session.type_name, Person_Session.participant_username, Person_Session.accepted from Session inner join Person_Session on Session.id = Person_Session.session_id;";
    infoRoute(_query,res);
     
 }

 // zeige die Follower des "username"
 module.exports.getAllFollower = function(res,username){

    _query = "select Follow_Person.follower_username from Follow_Person where Follow_Person.followable_username = '" + username + "';";
    console.log(_query);
    infoRoute(_query,res);

 }

 // zeige wem "username" folgt
 module.exports.getAllFollows = function(res,username){
    
        _query = "select Follow_Person.followable_username from Follow_Person where Follow_Person.follower_username = '" + username +"';";
        console.log(_query);
        infoRoute(_query,res);
    
     }

module.exports.getAllComments = function(res){

    _query = "select * from Comment;";
    console.log(_query);
    infoRoute(_query,res);

}     

 // show:filtered

 module.exports.getInstrumentalByID = function(res,id){

    _query = "SELECT * FROM Instrumental where id = '" + id + "';";
    infoRoute(_query,res);

 }

module.exports.getSessionByID = function(res,id){
        
    _query = "select Session.id, Session.date, Session.creator_username, Session.topic_name, Session.type_name, Person_Session.participant_username, Person_Session.accepted from Session inner join Person_Session on Session.id = Person_Session.session_id where Session.id = "+ id +";";
    infoRoute(_query,res);
}

module.exports.getCommentByID = function(res,id){
    
_query = "select Session.id, Session.date, Session.creator_username, Session.topic_name, Session.type_name, Person_Session.participant_username, Person_Session.accepted from Session inner join Person_Session on Session.id = Person_Session.session_id where Session.id = "+ id +";";
infoRoute(_query,res);
}



module.exports.execute = execute;
module.exports.qResultToJSON = qResultToJSON;