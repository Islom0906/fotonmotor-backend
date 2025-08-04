const mongoose=require('mongoose')
const Joi =require('joi')



const counterSchema=new mongoose.Schema({
    saleYear:{
        type:Number,
        required:true
    },
    serviceCount:{
        type:Number,
        required:true
    },
    countCar:{
        type:Number,
        required:true
    },
    client:{
        type:Number,
        required:true
    },

})

const CounterSchema=mongoose.model('Counter',counterSchema)

function validate(counter){
    const Counter=Joi.object({
        saleYear:Joi.number().required(),
        serviceCount:Joi.number().required(),
        countCar:Joi.number().required(),
        client:Joi.number().required(),
    })

    return Counter.validate(counter)
}


module.exports.Counter=CounterSchema
module.exports.validate=validate