const express = require('express')
const router = express.Router()
const {About,validate} = require('../model/aboutSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody=require('../utils/isValidIdBody')
const validId=require('../middleware/validId')
const deleteMedias=require('../utils/deleteMedias')
const mongoose = require("mongoose");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    try {

    const about = await About.find()
        .populate('image','-_id path')

    res.send(about[0])
    }catch (error){
        res.status(500).send(error.message)
    }
})


// GET
router.get('/:id', auth,async (req, res) => {
    const about = await About.findById(req.params.id)
        .populate('image')

    res.send(about)
})
// POST
router.post('/', async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const ValidId = isValidIdBody([req.body.image])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }


    try {
        const about = await About.create(req.body)
        res.status(201).send(about)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT
router.put('/:id', [auth,validId], async (req, res) => {

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const ValidId = isValidIdBody([req.body.image])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }

    try {
        const about = await About.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!about) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(about)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {
    const about = await About.findByIdAndDelete(req.params.id)
    if (!about) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    const imagesId = [about.image].map(id=> new mongoose.Types.ObjectId(id))
    const getDeleteImages=await Media.find({'_id':{
        $in:imagesId
        }})


    await Media.deleteMany({_id: {$in: imagesId}})
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            res.send(error.message)
        });
    await deleteMedias(getDeleteImages)

    if (!about) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(about)
})

module.exports=router