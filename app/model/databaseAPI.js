var fs = require("fs");

var name = "asd";
var password = "asd";

function create(_name,_password){
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

exports.name = name;
exports.password = password;

module.exports.read = read;
module.exports.create = create;
module.exports.remove = remove;
module.exports.update = update;