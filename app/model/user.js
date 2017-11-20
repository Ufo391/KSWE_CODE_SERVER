var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var db = require('../model/databaseAPI');
 
var _name  = "";
var _password = "";

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

function compare(passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

function hash(password, username){

    _password = password;
    _name = username;

    bcrypt.genSalt(8, function (err, salt) {
        if (err) {
            console.log(err);
        }
        db.db_salt = salt;
        bcrypt.hash(_password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }            
            db.create(_name,hash);            
        });
    });
}

module.exports.compare = compare;
module.exports.hash = hash;
//module.exports = mongoose.model('User', UserSchema);