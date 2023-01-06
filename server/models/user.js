const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{timestamps:true})

userSchema.methods.matchPassword = async function (entered){
    return await bcrypt.compare(entered,this.password)
    
}
userSchema.pre('save', async function(next){
    if(!this.isModified){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt)
})

const User = mongoose.model('User',userSchema)
module.exports = User