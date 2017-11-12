var db = require('./databaseAPI');

function login(id, password){    
    
    //db.read(id);
    if(password === "pass"){
        return true;
    }
    else{
        return false;
    }    
}

module.exports.login = login;