var fs = require("fs");

db_name = "asd";
db_password = "asd";

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