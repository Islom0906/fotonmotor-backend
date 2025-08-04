const {Schema,model}=require('mongoose')
const Joi=require('joi')

const testDriveSchema= new Schema({
        model:{
            type:String,
            required:true,
        },
        name:{
            type:String,
            required:true,
        },
        tel:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    })

const TestDrive=model('TestDrive',testDriveSchema)

function validate(testDrive){
    const validateTestDrive=Joi.object({
        model:Joi.string().required(),
        name:Joi.string().required(),
        tel:Joi.string().required(),
    })

    return validateTestDrive.validate(testDrive)
}


module.exports.TestDrive=TestDrive
module.exports.validate=validate