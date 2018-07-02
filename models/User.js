const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs')
  userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
}) 

userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password)
}``

userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password)
}


userSchema.pre('save', function(next){
    if(this.isModified('password')){
      this.password = this.generateHash(this.password)
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User