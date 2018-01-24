var path = require('path');
var fs = require('fs');
var db = require('../model/databaseAPI');

var uploads_location = path.dirname(require.main.filename) + '/files/';

module.exports.initialize = function(){
  
  initFilesDir();  
  
  
}
  
function initFilesDir(){
  
  createDir('./files');
  createDir('./files/audio');
  createDir('./files/video');

}
  
function createDir(_path){
  
  if(fs.existsSync(_path) === false){
    fs.mkdirSync(_path);

  }

}

// Empfange Datei vom Client
module.exports.fromClient = function(req,res,username)
{

  // Validiere
  var session_id = req.body.session_id;
  var instrumental_id = req.body.instrumental_id;
  var content_duration = req.body.content_duration;  

  if(req.files === null){
    res.json({success: false, msg: 'No File selected!'});
    return;
  }

  if( session_id === undefined || instrumental_id === undefined || content_duration === undefined){
    res.json({success: false, msg: 'Some parameter are undefined: session_id = ' + session_id + " & instrumental_id = " + instrumental_id + " & content_duration = " + content_duration});
    return;
  }

  db.getLocalSessionByID(session_id,function(result){

    // ist uploader bereichtigt ?
    if((result.creator_username === username || result.participant_username === username) === false){
      
      res.json({success: false, msg: username + ' is prohibited to upload Content to this Session!', session: result});
      return;

    }else{

      // Download
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
        db.CreateContent(req,res,username,uploadpath);      
      }
      });

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

  if(mode === undefined || parameter === undefined){
    res.json({success: false, msg: 'Some header element are undefined: mode = ' + mode + " & parameter = " + parameter});
    return;
  }

  if(mode && parameter){

    var _query = "";

    if(mode === "audio:id"){

      _query = "select Instrumental.audio_binary_path from Instrumental where id = "+ parameter +";";

      db.execute(_query,function(result){

        var filepath = uploads_location + db.qResultToJSON(result).audio_binary_path;        
        download(filepath,res);

      });

    }else if(mode === "video:id"){

      _query = "select Content.video_binary_path from Content where id = "+ parameter +";";
      
            db.execute(_query,function(result){
      
              var filepath = db.qResultToJSON(result).video_binary_path;        
              download(filepath,res);      
            });

    }else{

      res.json({success: false, msg: 'Invalid mode: ' + mode});

    }
  }
  else{
    res.json({success: false, msg: 'Invalid header', header: req.headers});
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