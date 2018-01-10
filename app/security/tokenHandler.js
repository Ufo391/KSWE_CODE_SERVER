var jwt = require('jwt-simple');

// Validiert die Gültigkeit einer Anfrage anhand des mitgegebenen Tokens
module.exports = function(req,res,callback){  

    if(req.headers.authorization === undefined){
        res.json({success: false, msg: 'missing token!'});
        return;
    }

    try{
        var encrypted_token = jwt.decode(getToken(req.headers), secret_token);
        
        callback(req,res,encrypted_token.username);
    }
    catch(e){
        console.log('TokenError --> ' + e);
        res.json({success: false, msg: '' + e});
    }
}