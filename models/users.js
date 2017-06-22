//User Schema for signing-up//

//Import Mongoose and crate user schema//
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Bring in brcypt-nodejs package for user encryption//
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  email:{type:String, required:true},
  password:{type:String, required:true}
});

//Add new user method with a function that will receive a hashed password as arguement//
//This password is run through hashSync function with 5 rounds of salting, and returns//
//this encrypted password//
userSchema.methods.encryptPassword = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

//Add new user method that will validate received password with any ext'g hashed password//
userSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
  //this.password refers to password of the current user in the session//
};

module.exports = mongoose.model('User', userSchema);
