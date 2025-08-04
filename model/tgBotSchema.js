const {model,Schema}=require('mongoose')
const Joi=require('joi')

const tgBotSchema=new Schema({
    name:{
        type:String,
        required:true,
    },
    tgId:{
        type:String,
        required:true,
        unicode:true
    },
    role:{
        type:String,
        required:true,
    },



})



const TgBot=model('TgBot',tgBotSchema)

function validate(tgBot){
    const validateTgBot=Joi.object({
        name:Joi.string().required(),
        tgId:Joi.string().required(),
        role:Joi.string().required(),
    })

    return validateTgBot.validate(tgBot)
}


module.exports.TgBot=TgBot
module.exports.validate=validate


