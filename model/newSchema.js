const mongoose = require('mongoose')
const Joi = require('joi')


const newsSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.ObjectId,
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

},{
    timestamps:true
})

const News = mongoose.model('News', newsSchema)

function validate(banner) {
    const bannerValid = Joi.object({
        image: Joi.string().required(),
        titleRu: Joi.string().required(),
        textRu: Joi.string().required(),
    })

    return bannerValid.validate(banner)
}

exports.News = News
exports.validate = validate