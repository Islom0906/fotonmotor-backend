const express=require('express')
const router=express.Router()
const {User,validate} =require('../model/userSchema')
const _ =require('lodash')
const bcrypt = require("bcrypt");
const auth=require('../middleware/auth')

router.get('/me', auth,async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).select('-password')
        res.send(user)
    }catch (error){
        res.sendStatus(401).send('Bunday user yo\'q')
    }
})



router.get('/',auth,async (req,res)=>{

    const user=await User.find().select('-password')
    res.send(user)
})

router.post('/',async (req,res)=>{

    const {error}=validate(req.body)

    if (error){
        return res.status(400).send(error.details[0].message)
    }

    let user=await User.findOne({email:req.body.email})

    if (user){
        return res.status(400).send('Bu email bilan ro\'yxatdan o\'tilgan' )
    }
    try{

    let user=req.body

    // user= new User(req.body)
    const salt=await bcrypt.genSalt()
    user.password=await bcrypt.hash(user.password, salt)

    let userSave=await User.create(user)

    res.send(_.pick(userSave,['_id','name','email','isAdmin']))
    } catch (error){
        res.send(error)
    }
})




module.exports=router