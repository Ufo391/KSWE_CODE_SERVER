var fs = require("fs");

function read(req, res){

    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
        //console.log( data );
        res.end( data );
    });

}

module.exports.read = read;