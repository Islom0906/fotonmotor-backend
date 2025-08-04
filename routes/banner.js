const express = require('express')
const router = express.Router()
const {BannerHome,validate} = require('../model/bannerSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody=require('../utils/isValidIdBody')
const validId=require('../middleware/validId')
const deleteMedias=require('../utils/deleteMedias')
const mongoose = require("mongoose");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    try{
        const banner = await BannerHome.find()
            .populate('bannerWeb','path -_id')
            .populate('bannerRes','path -_id')
            .sort({ _id: -1 })

        res.send(banner)

    }catch (error){
        res.status(500).send(error)
    }
})

// GET
router.get('/:id', async (req, res) => {
    const banner = await BannerHome.findById(req.params.id)
        .populate('bannerWeb')
        .populate('bannerRes')

    res.send(banner)
})

// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const ValidId = isValidIdBody(
        [req.body.bannerWeb, req.body.bannerRes]
    )
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }



    try {
        const banner = await BannerHome.create(req.body)
        res.status(201).send(banner)

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


    const ValidId = isValidIdBody([req.body.bannerWeb, req.body.bannerRes])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }

    try {
        const banner = await BannerHome.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!banner) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(banner)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {
    try {
        const banner = await BannerHome.findByIdAndDelete(req.params.id)
        if (!banner) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }


        const deleteImageId = [banner.bannerWeb, banner.bannerRes].map(id => new mongoose.Types.ObjectId(id))
        const getDeleteImages = await Media.find({
            '_id': {
                $in: deleteImageId
            }
        })

        await Media.deleteMany({_id: {$in: deleteImageId}})
            .then((result) => {
                console.log(result)
            })
            .catch((error) => {
                res.send(error.message)
            });

        await deleteMedias(getDeleteImages)
        res.send(banner)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports=router