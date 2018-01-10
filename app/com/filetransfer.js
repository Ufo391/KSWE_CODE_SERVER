var path = require('path');
var fs = require('fs');
var db = require('../model/databaseAPI');

var uploads_location = path.dirname(require.main.filename) + '/files/';

// Empfange Datei vom Client
module.exports.fromClient = function(req,res)
{

  if(req.files === undefined){
    res.json({success: false, msg: 'No File selected!'});
    return;
  }

  var file = req.files.upfile,
    name = file.name,
    type = file.mimetype;

  var uploadpath = uploads_location + 'video/' + name;  
  uploadpath = duplicateFileHandler(uploadpath,name);

  file.mv(uploadpath,function(err){
    if(err){
      console.log("File Upload Failed",name,err);        
      res.json({success: false, msg: 'Error Occured!'});
    }
    else {
      console.log("File Uploaded",name);        
      res.json({success: true, msg: 'Done! Uploading files'});
      // Datenbank eintrag
    }
  });

}

function duplicateFileHandler(_path,name){

  if(fs.existsSync(_path) == true){
    var counter = 2;
    while(true){
      var new_path = uploads_location + 'video/' + counter + '_' + name;
      if(fs.existsSync(new_path) === false){return new_path;}
      counter++;
    }
  }

  return _path;

}

// Sende zum Client geforderte Datei
module.exports.toClient = function(req,res)
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