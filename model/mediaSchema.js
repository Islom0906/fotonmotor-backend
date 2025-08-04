const mongoose=require('mongoose')


const mediaSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    path:{
        type:String,
        required: true
    }
})

const Media=mongoose.model('Media',mediaSchema)

module.exports.Media=Media
module.exports.mediaSchema=mediaSchema