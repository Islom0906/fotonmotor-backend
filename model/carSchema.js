const {Schema,model}=require('mongoose')
const Joi = require("joi");

const characterSchema = new Schema({
    keyRu: {
        type:String,
        required: true
    },

    valueRu: {
        type:String,
        required: true
    },

})

const exteriorCardListSchema = new Schema({
    image: {
        type: Schema.ObjectId,
        ref: 'Media',
        required: true
    },
    titleRu: {
        type: String,
        required: true
    },

    textRu: {
        type: String,
        required: true
    },

})

const exteriorReviewSchema = new Schema({
    bannerImage: {
        type: Schema.ObjectId,
        ref: 'Media',
        required: true
    },
    textRu: {
        type: String,
        required: true
    },

    list: {
        type: [exteriorCardListSchema],
        required: true
    }
})

const interiorReviewSchema = new Schema({
    bannerImage: {
        type: Schema.ObjectId,
        ref: 'Media',
        required: true
    },
    titleRu: {
        type: String,
        required: true
    },

    textRu: {
        type: String,
        required: true
    },

    list: {
        type: [Schema.ObjectId],
        ref: 'Media',
        required: true
    }
})
const equipmentListSchema = new Schema({
    textRu: {
        type: String,
        required: true
    },

})




const technicalCharacterSchema = new Schema({
    image: {
        type: Schema.ObjectId,
        ref: 'Media',
        required: true
    },
    titleRu: {
        type: String,
        required: true
    },


})


const carSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    // price:{
    //     type:Number,
    //     required:true
    // },
    bannerWeb: {
        type:Schema.ObjectId,
        ref:'Media',
        required:true
    },
    bannerRes: {
        type:Schema.ObjectId,
        ref:'Media',
        required:true
    },


    character: {
        type: [characterSchema],
        required:true
    },
    exteriorReview: {
        type: exteriorReviewSchema,
        required:true
    },
    interiorReview: {
        type: interiorReviewSchema,
        required:true
    },
    equipment: {
        type: [equipmentListSchema],
        required: true
    },
    technicalCharacter: {
        type: [technicalCharacterSchema],
        required: true
    },

    gallery:{
        type: [Schema.ObjectId],
        ref: 'Media',
        required:true
    },

    imageHome: {
        type: Schema.ObjectId,
        ref: 'Media',
        required:true
    },
    slug:{
        type:String,
        required:true
    },
})
const Car = model('Car', carSchema)




function validate(car){
    const Car=Joi.object({
        name:Joi.string().required(),
        // price:Joi.number().required(),
        bannerWeb: Joi.string().required(),
        bannerRes: Joi.string().required(),
        character: Joi.array().items(Joi.object(
            {
                keyRu: Joi.string().required(),
                valueRu: Joi.string().required(),
            }
        )).required(),
        exteriorReview: Joi.object({
            bannerImage: Joi.string().required(),
            textRu: Joi.string().required(),
            list: Joi.array().items(Joi.object({
                image:Joi.string().required(),
                titleRu:Joi.string().required(),
                textRu:Joi.string().required(),
            })),
        }).required(),
        interiorReview: Joi.object({
            bannerImage: Joi.string().required(),
            titleRu: Joi.string().required(),
            textRu: Joi.string().required(),
            list: Joi.array().items(Joi.string().required()),
        }).required(),
        equipment:Joi.array().items(Joi.object({
            textRu:Joi.string().required(),
        })).required(),
        technicalCharacter:Joi.array().items(Joi.object({
            image:Joi.string().required(),
            titleRu:Joi.string().required(),

        })).required(),
        imageHome:Joi.string().required(),
        gallery:Joi.array().items(Joi.string().required())
    })

    return Car.validate(car)
}

module.exports.carSchema = carSchema
module.exports.Car=Car
module.exports.validate=validate

