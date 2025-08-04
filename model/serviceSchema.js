const {Schema,model}=require('mongoose')
const Joi=require('joi')



const serviceSchema=new Schema({
    titleRu:{
        type:String,
        required:true
    },
    textRu:{
        type:String,
        required:true
    },
    icon:{
        type:Schema.ObjectId,
        ref:'Media',
        required:true
    }
})

const Service=model('Service',serviceSchema)

function validate(service){
    const Service=Joi.object({
            titleRu:Joi.string().required(),
            textRu:Joi.string().required(),
            icon:Joi.string().required(),
    })

    return Service.validate(service)
}


module.exports.Service=Service
module.exports.validate=validate