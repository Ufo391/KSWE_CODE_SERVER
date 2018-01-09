var jwt = require('jwt-simple');

// Validiert die Gültigkeit einer Anfrage anhand des mitgegebenen Tokens
module.exports = function(req,res){
    // momentan noch ohne Validierung
    return jwt.decode(getToken(req.headers), secret_token);
}