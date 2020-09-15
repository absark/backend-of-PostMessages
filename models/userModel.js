const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
     email:{
         type:String,
         unique:true,
         required:[true,'Email is required !']
     },
     password:{
         type:String,
         select:false,
         required:[true,'Password is required !']
     }
});

// Encrypt the password when it will create & change
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();

});



userSchema.methods.comparePassword = async function(password,encriptedPass){
    return await bcrypt.compare(password,encriptedPass);
}

userSchema.plugin(uniqueValidator);

const User = mongoose.model('User',userSchema);
module.exports =User;
