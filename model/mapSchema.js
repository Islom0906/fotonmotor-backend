const mongoose=require('mongoose')
const Joi=require('joi')

const mapSchemaOld=new mongoose.Schema({
    nameRu:{
        type:String,
        required:true,
    },

    addressRu:{
        type:String,
        required:true,
    },

    workingTime:{
        type:String,
        required:true,
    },
    tel:{
        type:String,
        required:true,
    },
    lat:{
        type:String,
        required:true,
        unique:true
    },
    lng:{
        type:String,
        required:true,
        unique:true

    },

})

const Map=mongoose.model('Map',mapSchemaOld)

function validate(map){
    const validateMap=Joi.object({
        nameRu:Joi.string().required(),
        addressRu:Joi.string().required(),
        workingTime:Joi.string().required(),
        tel:Joi.string().required(),
        lat:Joi.string().required(),
        lng:Joi.string().required(),

    })

    return validateMap.validate(map)
}

module.exports.Map=Map
module.exports.validate=validate