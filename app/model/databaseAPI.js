var fs = require("fs");

db_name = "Hans";
db_password = "$2a$10$auDYyx1oUSkSVRRtZg.3Y.l252pbawB5PAmabALRRsKskFGeojU/S";
secret_token = "SUPERDUPERGEHEIM";
db_token = "";

database = [];


module.exports.create = function (name,password){
        
    var obj = new Object();
    obj.name = name;
    obj.password = password;
    var str_json = JSON.stringify(obj);

    database.push(str_json);
    console.log("Inserted: " + database[0]);
}

module.exports.insertToken = function(name,token){
    db_token = token;
}

module.exports.findUser = function(name){

    for (i in database) {
        var user = JSON.parse(database[i]);
        if(name == user.name){
            return user;
        }
    } 

    return null;

}