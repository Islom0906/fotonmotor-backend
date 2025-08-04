const mongoose=require('mongoose')

function isValidIDs(ids) {
    if (typeof ids==="string"){
        return mongoose.Types.ObjectId.isValid(ids)
    }
    const isvalid=ids.every(id => mongoose.Types.ObjectId.isValid(id));
    return isvalid
}

module.exports=isValidIDs