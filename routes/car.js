const express = require('express')
const router = express.Router()
const {Car, validate} = require('../model/carSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody = require('../utils/isValidIdBody')
const validId = require('../middleware/validId')
const deleteMedias = require('../utils/deleteMedias');
const mongoose = require("mongoose");
const slugify = require("slugify");
const auth=require('../middleware/auth')
const {generateUniqueSlug, generateUniqueSlugForUpdate} = require("../utils/generateUniqueSlug");

// GET

router.get('/', async (req, res) => {
    try {
        const {pageSize, pageNumber} = req.query



        let data;
        if (pageSize && pageNumber) {
            const limit = parseInt(pageSize, 10);
            const skip = (parseInt(pageNumber, 10) - 1) * limit;
            data = await Car.find()
                .select('name imageHome slug price')
                .populate('imageHome','path -_id')
                .skip(skip)
                .limit(limit)
                .sort({ _id: -1 })
        } else {
            data = await Car.find()
                .select('name imageHome slug price')
                .populate('imageHome','path -_id')
                .sort({ _id: -1 })

        }

        res.json(data);

    } catch (error) {
        res.status(500).send(error.message)
    }
})





router.get('/model', async (req, res) => {
    try {

        const car = await Car.find()
            .select('name')
            .populate('carCard', 'path -_id')

        res.send(car)

    } catch (error) {
        res.status(500).send(error.message)
    }
})


// GET by slug

router.get('/:slug', async (req, res) => {
    try {
        const car = await Car.findOne({slug: req.params.slug})
            .populate('bannerWeb', 'path')
            .populate('bannerRes', 'path')
            .populate('exteriorReview.list.image', 'path')
            .populate('exteriorReview.bannerImage', 'path')
            .populate('interiorReview.bannerImage', 'path')
            .populate('interiorReview.list', 'path')
            .populate('technicalCharacter.image', 'path')
            .populate('imageHome', 'path')
            .populate('gallery', 'path')


        if (!car) {
            res.send('Berilgan slug bo\'yicha malumot yo\'q')
        }

        if (car.position || !car.position.length > 0) {
            res.send(car)
        } else {
            await car.populate('position')

            res.send(car)
        }


    } catch (error) {
        res.sendStatus(500).send(error)

    }
})

// GET by id

router.get('/id/:id', async (req, res) => {
    try {
        const car = await Car.findById(req.params.id)
            .populate('bannerWeb')
            .populate('bannerRes')
            .populate('exteriorReview.bannerImage')
            .populate('exteriorReview.list.image')
            .populate('interiorReview.bannerImage')
            .populate('interiorReview.list')
            .populate('technicalCharacter.image')
            .populate('imageHome')
            .populate('gallery')

        if (car) {
            res.send(car)
        } else {
            res.send('Berilgan id bo\'yicha malumot yo\'q')
        }
    } catch (error) {
        res.sendStatus(500).send(error)

    }
})

// POST
router.post('/', auth,async (req, res) => {

    const {error} = validate(req.body)
    const checkImageId = []
    if (error) {
        return res.status(400).send(error.details[0].message)
    }

    req.body.exteriorReview.list?.map(item => {
        checkImageId.push(item.image)
    })
    req.body.interiorReview.list?.map(item => {
        checkImageId.push(item)
    })
    req.body.technicalCharacter?.map(item => {
        checkImageId.push(item.image)
    })



    const ValidId = isValidIdBody([
        req.body.bannerWeb,
        req.body.bannerRes,
        req.body.exteriorReview.bannerImage,
        req.body.interiorReview.bannerImage,
        req.body.imageHome,
        ...req.body.gallery,
        ...checkImageId
    ])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }

    const baseSlug = slugify(req.body.name)
    const uniqueSlug = await generateUniqueSlug(baseSlug, Car);

    try {
        const car = await Car.create({
            slug: uniqueSlug,
            ...req.body
        })
        res.status(201).send(car)

    } catch (error) {
        res.send(error.message)
    }

})

//PUT
router.put('/:id', [auth,validId], async (req, res) => {
    const {error} = validate(req.body)
    const checkImageId = []
    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    req.body.exteriorReview.list?.map(item => {
        checkImageId.push(item.image)
    })
    req.body.interiorReview.list?.map(item => {
        checkImageId.push(item)
    })

    req.body.technicalCharacter?.map(item => {
        checkImageId.push(item.image)
    })

    const ValidId = isValidIdBody([
        req.body.bannerWeb,
        req.body.bannerRes,
        req.body.exteriorReview.bannerImage,
        req.body.interiorReview.bannerImage,
        ...req.body.gallery,

        req.body.imageHome,
        ...checkImageId
    ])
    if (!ValidId) {
        return res.status(400).send('Mavjud bo\'lmagan id')
    }
    const baseSlug = slugify(req.body.name)
    const uniqueSlug = await generateUniqueSlugForUpdate(baseSlug, Car, req.params.id);

    try {
        const car = await Car.findByIdAndUpdate(req.params.id, {
            slug: uniqueSlug,
            ...req.body
        }, {new: true})

        if (!car) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(car)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {
    try {

    const car = await Car.findByIdAndDelete(req.params.id)
    if (!car) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }
    const deleteImageId = []
        car.exteriorReview.list?.map(item => {
            deleteImageId.push(item.image)
        })
        car.interiorReview.list?.map(item => {
            deleteImageId.push(item)
        })

        car.technicalCharacter?.map(item => {
            checkImageId.push(item.image)
        })



        const imagesId = [
            car.bannerWeb,
            car.bannerRes,
            car.exteriorReview.bannerImage,
            car.interiorReview.bannerImage,
            ...car.gallery,
            car.imageHome,
        ...deleteImageId
    ].map(id => new mongoose.Types.ObjectId(id))
        console.log(imagesId)
    const getDeleteImages = await Media.find({
        '_id': {
            $in: imagesId
        }
    })
        console.log(getDeleteImages)


    await Media.deleteMany({_id: {$in: imagesId}})
        .then((result) => {
            console.log(result)
        })
        .catch((error) => {
            res.send(error.message)
        });
    await deleteMedias(getDeleteImages)
        res.send(car)
    }catch (error) {
        res.send(error)
    }
})

module.exports = router