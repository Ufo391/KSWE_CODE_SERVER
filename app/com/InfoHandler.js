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

        }else{
            res.json({success: false, msg: 'unknown parameter: ' + param});
            return;
        }

    }
    else if(mode === 'show:filtered'){

        var params = param.split(":");

        if(params.length !== 2){
            res.json({success: false, msg: 'invalid parameter: ' + param});
            return;
        }

        if(params[0] === 'instrumental'){

            _query = "SELECT * FROM Instrumental where genre_name = '" + params[1] + "';";            

        }else{
            res.json({success: false, msg: 'unknown parameter: ' + param});
            return;
        }        
        
    }
    else{
        res.json({success: false, msg: 'unknown mode: ' + mode});
        return;
    }

    db.query(_query,function(result){
        res.json({success: true, msg: result}); 
    });
}