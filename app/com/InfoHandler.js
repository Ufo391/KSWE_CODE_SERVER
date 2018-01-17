var db = require('../model/databaseAPI');

module.exports = function(req,res){

    var mode = req.headers.mode;
    var param = req.headers.parameter;

    if(mode === undefined || param === undefined){
        res.json({success: false, msg: 'missing mode or parameter!'});
        return;
    }

    if(mode === 'show:all'){

        if(param === 'genre'){

            db.getAllGenre(res);

        }else if(param === 'instrumental'){

            db.getAllInstrumental(res);

        }else if(param === 'topic'){
            
            db.getAllTopic(res);
            
        }else if(param === 'type'){
            
            db.getAllType(res);
            
        }else if(param === 'session'){
            
            db.getAllSession(res);
            
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
                    db.getInstrumentalByID(res,params[2]);
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
}