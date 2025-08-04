const {Schema,model}=require('mongoose')
const Joi = require("joi");
const orderSchema=new Schema({
    userName:{type:String,required:true},
    phone:{type:String,required:true},
    model:{type:String,required:true},

},{
    timestamps:true
})

const Order=    model('Order',orderSchema)

function validate(order){
    const validateOrder=Joi.object({
        userName:Joi.string().required(),
        phone:Joi.string().required(),
        model:Joi.string().required(),


    })

    return validateOrder.validate(order)
}

module.exports.Order=Order
module.exports.validate=validate