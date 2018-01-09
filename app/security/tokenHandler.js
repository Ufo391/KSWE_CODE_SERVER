var jwt = require('jwt-simple');

// Validiert die Gültigkeit einer Anfrage anhand des mitgegebenen Tokens
module.exports = function(req,res,callback){
    
    // momentan noch ohne Sicherheitsvalidierung    

    if(req.headers.authorization === undefined){
        res.json({success: false, msg: 'missing token!'});
        return;
    }

    var encrypted_token = jwt.decode(getToken(req.headers), secret_token);
    
    if(!encrypted_token){
        res.json({success: false, msg: 'Invalid token!'});
        return;
    }

    callback(req,res,encrypted_token.username);
}