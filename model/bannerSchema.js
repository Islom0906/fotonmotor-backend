const mongoose=require('mongoose')
const Joi=require('joi')


const bannerHomeSchema=new mongoose.Schema({
    bannerWeb:{
        type:mongoose.Schema.ObjectId,
        ref:'Media',
        default:null
    },
    bannerRes:{
        type:mongoose.Schema.ObjectId,
        ref:'Media',
        default:null
    }
})

const BannerHome=mongoose.model('BannerHome',bannerHomeSchema)

function validate(banner){
    const bannerValid=Joi.object({
        bannerWeb:Joi.string().allow(null),
        bannerRes:Joi.string().allow(null),
    })

    return bannerValid.validate(banner)
}

exports.BannerHome=BannerHome
exports.validate=validate