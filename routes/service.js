const express = require('express')
const router = express.Router()
const {Service,validate} = require('../model/serviceSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody=require('../utils/isValidIdBody')
const validId=require('../middleware/validId')
const deleteMedias=require('../utils/deleteMedias')
const mongoose = require("mongoose");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    try {

    const service = await Service.find()
        .populate('icon','-_id path')

    res.send(service)
    }catch (error){
        res.status(500).send(error.message)
    }
})


// GET
router.get('/:id', async (req, res) => {
    const service = await Service.findById(req.params.id)
        .populate('icon','-_id path')


    res.send(service)
})
// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const ValidId = isValidIdBody([req.body.icon])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }


    try {
        const service = await Service.create(req.body)
        res.status(201).send(service)

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



    const ValidId = isValidIdBody([req.body.icon])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }

    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!service) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(service)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const deleteImageID=[service.icon]


    const imagesId = deleteImageID.map(id=> new mongoose.Types.ObjectId(id))
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

    if (!service) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(service)
})

module.exports=router