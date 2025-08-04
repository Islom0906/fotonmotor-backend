const {model,Schema}=require('mongoose')
const Joi=require('joi')

const contactSchema=new Schema({
    facebook:{
        type:String,
        required:true
    },
    telegram:{
        type:String,
        required:true
    },
    instagram:{
        type:String,
        required:true
    },
    youtube:{
        type:String,
        required:true
    },
    tel:{
        type:[String],
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
    },
    lat:{
        type:String,
        required:true,
    },
    lng:{
        type:String,
        required:true,
    },
})

const Contact=model('Contact',contactSchema)

function validate(contact){
    const Contact=Joi.object({
        facebook:Joi.string().required(),
        telegram:Joi.string().required(),
        instagram:Joi.string().required(),
        youtube:Joi.string().required(),
        tel:Joi.array().items(Joi.string()).required(),
        address:Joi.string().required(),
        email:Joi.string().required(),
        lat:Joi.string().required(),
        lng:Joi.string().required(),


    })

    return Contact.validate(contact)
}

module.exports.Contact=Contact
module.exports.validate=validate