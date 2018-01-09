var db = require('../model/databaseAPI');

module.exports = function(req,res){

    var mode = req.headers.mode;
    var param = req.headers.parameter;
    var _query = "";

    if(mode === undefined || param === undefined){
        res.json({success: false, msg: 'missing mode or parameter!'});
        return;
    }

    if(mode === 'show'){

        if(param === 'genre'){

        _query = "SELECT * FROM Genre;";

        }else if(param === 'instrumentals'){

            _query = "SELECT * FROM Instrumental;";

        }else{
            res.json({success: false, msg: 'unknown parameter!'});
            return;
        }

    }
    else{
        res.json({success: false, msg: 'unknown mode!'});
        return;
    }

    db.query(_query,function(result){
        res.json({success: true, msg: result}); 
    });
}