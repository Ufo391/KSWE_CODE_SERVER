var fs = require("fs");

var database = '{"user":[{"id":1,"name":"hannes","password":"test"},{"id":2,"name":"rudi","password":"test"}]}';

function read(id){

    var obj = JSON.parse(database);

    obj.user.forEach(function(element) {
        if(id === element.id){
            console.log("goal");
            return element.password;
        }        
    });        
}

module.exports.read = read;