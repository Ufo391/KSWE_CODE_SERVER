var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');


_hash = "";

// set up a mongoose model
var UserSchema = new Schema({
  name: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    }
});
 
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});
 
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

function compare(input,hash, cb) {
    bcrypt.compare(input, hash, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

function hash(password, username){

    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.log(err);
        }            
        db.create(username,hash);            
    });

}

function hashTest(word){

    bcrypt.compare(word, db_password, function(err,res){
        console.log(res);
    });

}

module.exports.compare = compare;
module.exports.hash = hash;
module.exports.hashTest = hashTest;
//module.exports = mongoose.model('User', UserSchema);