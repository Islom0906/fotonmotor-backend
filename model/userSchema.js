


const {model,Schema}=require('mongoose')
const Joi=require('joi')
const jwt = require("jsonwebtoken");

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    }
})

userSchema.methods.generateAuthToken=function (user){
    return jwt.sign({_id:user._id,isAdmin:user.isAdmin},process.env.JWT_PRIVATE_KEY,{expiresIn: '5h'})
}


const User=model('User',userSchema)

function validate(user){
    const userValid=Joi.object({
        name:Joi.string().required(),
        email:Joi.string().required().email(),
        password:Joi.string().required(),
        isAdmin:Joi.bool().required()
    })

    return userValid.validate(user)
}

exports.User=User
exports.validate=validate