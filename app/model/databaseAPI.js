var fs = require("fs");

db_name = "Hans";
db_password = "$2a$10$auDYyx1oUSkSVRRtZg.3Y.l252pbawB5PAmabALRRsKskFGeojU/S";
secret_token = "SUPERDUPERGEHEIM";
db_token = "";

function create(name,password){    
    db_name = name;
    db_password = password;
    console.log("Inserted: " + db_name + " | " + db_password);
}

function remove(){

}

function update(){

}

function read(){

}

module.exports.read = read;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;