var db = require('./databaseAPI');

function login(id, password){    
    console.log("id: " + id + " | " + "password: " + password);
    if(password === "pass"){
        return true;
    }
    else{
        return false;
    }    
}

module.exports.login = login;