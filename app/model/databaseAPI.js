var fs = require("fs");

var name = "";
var password = "";

function insert(_name,_password){
    name = _name;
    password = _password;
    console.log("Inserted: " + name + " | " + password);
}

function remove(){

}

function update(){

}

function read(){

}

module.exports.name = name;
module.exports.password = password;

module.exports.read = read;
module.exports.insert = insert;
module.exports.remove = remove;
module.exports.update = update;