const express = require('express')
const router = express.Router()
const {News, validate} = require('../model/newSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody = require('../utils/isValidIdBody')
const validId = require('../middleware/validId')
const deleteMedias = require('../utils/deleteMedias');
const slugify = require("slugify");
const krillToLotin =require('../utils/krillToLotin')
const auth=require('../middleware/auth')


// GET
router.get('/', async (req, res) => {
    try {
        const {pageSize, pageNumber} = req.query
        let data
        if (pageSize && pageNumber) {
            const limit = parseInt(pageSize, 10);
            const skip = (parseInt(pageNumber, 10) - 1) * limit;
            data = await News.find()
                .select('image titleRu  createdAt textRu')
                .populate('image', 'path -_id')
                .skip(skip)
                .limit(limit)
        } else {

            data = await News.find()
            .select('image titleRu  createdAt textRu')
            .populate('image', 'path -_id')
        }

        res.send(data)

    } catch (error) {
        res.status(500).send(error.message)
    }
})



// GET by id
router.get('/id/:id', async (req, res) => {
    try {
        const news = await News.findById(req.params.id)
            .populate('image', )

        if (news) {
            res.send(news)
        } else {
            res.send('Berilgan slug bo\'yicha malumot yo\'q')
        }
    } catch (error) {
        res.sendStatus(500).send(error)

    }
})

// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }



    const ValidId = isValidIdBody(req.body.image)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }



    try {
        const news = await News.create(req.body)
        res.status(201).send(news)

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



    const ValidId = isValidIdBody(req.body.image)
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    try {
        const news = await News.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!news) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(news)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {

    const news = await News.findByIdAndDelete(req.params.id)
    if (!news) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    try {
        const deleteImage= await Media.findByIdAndDelete(news.image)

        await deleteMedias([deleteImage])
        res.send(news)
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = router