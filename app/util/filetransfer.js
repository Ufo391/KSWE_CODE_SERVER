var path = require('path');
var fs = require('fs');

var upload_location = path.dirname(require.main.filename) + '/uploads/';

module.exports.recive = function(req,res)
{
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = upload_location + name;
    destinationExists(upload_location);
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
        console.log("File Uploaded",name);
        res.send('Done! Uploading files')
      }
    });
  }
  else {
    res.send("No File selected !");
    res.end();
  };
}

function destinationExists(path){
  if(fs.existsSync(path) === false){
    fs.mkdirSync(path);
  }
}