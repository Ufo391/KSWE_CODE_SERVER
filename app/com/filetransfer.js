var path = require('path');
var fs = require('fs');

var uploads_location = path.dirname(require.main.filename) + '/uploads/';

// Empfange Datei vom Client
module.exports.recive = function(req,res)
{
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = uploads_location + '/' + req.headers.mode + '/' + name;
    destinationExists(uploads_location);
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);        
        res.json({success: false, msg: 'Error Occured!'});
      }
      else {
        console.log("File Uploaded",name);        
        res.json({success: true, msg: 'Done! Uploading files'});
      }
    });
  }
  else {    
    res.json({success: false, msg: 'No File selected!'});
    res.end();
  };
}

// Sende zum Client geforderte Datei
module.exports.send = function(req,res)
{    
  if(req.headers.filename){
    var file = uploads_location + '/' + req.headers.mode + '/' + req.headers.filename;
    res.download(file,function(err){
      if (err) {
        console.log('Download_Error: ' + err);
        res.json({success: false, msg: err});
      }
    });
  }
  else{
    res.json({success: false, msg: 'Invalid filename!'});
  }
}

function destinationExists(path){
  if(fs.existsSync(path) === false){
    fs.mkdirSync(path);
    fs.mkdirSync(path + '/video');
    fs.mkdirSync(path + '/audio');
  }
}