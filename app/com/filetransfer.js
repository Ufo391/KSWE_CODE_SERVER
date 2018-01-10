var path = require('path');
var fs = require('fs');
var db = require('../model/databaseAPI');

var uploads_location = path.dirname(require.main.filename) + '/files/';

// Empfange Datei vom Client
module.exports.recive = function(req,res)
{
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = uploads_location +  req.headers.mode + '/' + name;
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
  
  var mode = req.headers.mode;
  var parameter = req.headers.parameter;

  if(mode && parameter){

    var _query = "";

    if(mode === "audio:id"){

      _query = "select Instrumental.audio_binary_path from Instrumental where id = "+ parameter +";";

      db.query(_query,function(result){

        var filepath = uploads_location + 'audio/' + db.qResultToJSON(result).audio_binary_path;        
        download(filepath,res);

      });

    }else if(mode === "video:id"){

      _query = "select Content.video_binary_path from Content where id = "+ parameter +";";
      
            db.query(_query,function(result){
      
              var filepath = uploads_location + 'audio/' + db.qResultToJSON(result).audio_binary_path;        
              download(filepath,res);
      
            });

    }else{

      res.json({success: false, msg: 'Invalid mode: ' + mode});

    }
  }
  else{
    res.json({success: false, msg: 'Invalid header: ' + req.headers});
  }
}

function download(filepath,res){
  res.download(filepath,function(err){
    if (err) {
      console.log('Download_Error: ' + err);
      res.json({success: false, msg: err});
    }
  });
}


module.exports.send_old = function(req,res)
{    
  if(req.headers.filename){
    var filepath = uploads_location + '/' + req.headers.mode + '/' + req.headers.filename;
    res.download(filepath,function(err){
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