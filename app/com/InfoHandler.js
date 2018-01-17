var db = require('../model/databaseAPI');

module.exports = function(req,res){

    var mode = req.headers.mode;
    var param = req.headers.parameter;
    var _query = "";

    if(mode === undefined || param === undefined){
        res.json({success: false, msg: 'missing mode or parameter!'});
        return;
    }

    if(mode === 'show:all'){

        if(param === 'genre'){

        _query = "SELECT * FROM Genre;";

        }else if(param === 'instrumental'){

            _query = "SELECT * FROM Instrumental;";

        }else if(param === 'topic'){
            
            _query = "SELECT * FROM Topic;";
            
        }else if(param === 'type'){
            
            _query = "SELECT * FROM Type;";
            
        }else if(param === 'session'){
            
            _query = "select Session.id, Session.date, Session.creator_username, Session.topic_name, Session.type_name, Person_Session.participant_username, Person_Session.accepted from Session left join Person_Session on Session.id = Person_Session.session_id;";
            
        }
        else{
            res.json({success: false, msg: 'unknown parameter: ' + param});
            return;
        }

    }
    else if(mode === 'show:filtered'){

        var params = param.split(":");

        if(params.length !== 3){
            res.json({success: false, msg: 'invalid parameter: ' + param});
            return;
        }

        if(params[0] === 'instrumental'){

                if(params[1] === 'id'){
                    _query = "SELECT * FROM Instrumental where id = '" + params[2] + "';";
                }
                else{
                    res.json({success: false, msg: 'unknown parameter: ' + param});
                    return;
                }

        }else{
            res.json({success: false, msg: 'unknown parameter: ' + param});
            return;
        }        
        
    }
    else{
        res.json({success: false, msg: 'unknown mode: ' + mode});
        return;
    }

    db.execute(_query,function(result){
        if(result.length === 0){
            res.json({success: false, msg: 'no database entry found'}); 
        }else{            
            res.json({success: true, msg: result}); 
        }
        
    });
}