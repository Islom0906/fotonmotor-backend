module.exports=()=>{
    if (!process.env.JWT_PRIVATE_KEY){
        throw new Error('JIDDIY XATO: JWT_PRIVATE_KEY muhit o\'zgaruvchisi aniqlanmadi')
    }
}