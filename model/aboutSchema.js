const mongoose=require('mongoose')
const Joi =require('joi')

const valuesSchema=new mongoose.Schema({
    value:{
        type:String,
        required:true
    }
})



const aboutSchema=new mongoose.Schema({
    image:{
        type:mongoose.Schema.ObjectId,
        ref:'Media',
        required:true
    },

    textRu:{
        type:String,
        required:true
    },

    values:{
        type:[valuesSchema],
        required:true
    },
    missionRu:{
        type:String,
        required:true
    },

})

const About=mongoose.model('About',aboutSchema)

function validate(about){
    const About=Joi.object({
        image:Joi.string().required(),
        textRu:Joi.string().required(),
        values:Joi.array().items(Joi.object({
            value:Joi.string().required(),
        })).required(),
        missionRu:Joi.string().required(),
    })

    return About.validate(about)
}


module.exports.About=About
module.exports.validate=validate