const express = require('express')
const router = express.Router()
const {Counter,validate} = require('../model/counterSchema')
const {Media} = require('../model/mediaSchema')
const isValidIdBody=require('../utils/isValidIdBody')
const validId=require('../middleware/validId')
const deleteMedias=require('../utils/deleteMedias')
const mongoose = require("mongoose");
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    try {

    const counter = await Counter.find()

    res.send(counter[0])
    }catch (error){
        res.status(500).send(error.message)
    }
})
// GET
router.get('/:id', async (req, res) => {
    const banner = await Counter.findById(req.params.id)

    res.send(banner)
})
// POST
router.post('/', auth,async (req, res) => {
    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }






    try {
        const counter = await Counter.create(req.body)
        res.status(201).send(counter)

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




    try {
        const counter = await Counter.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!counter) {
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }
        res.send(counter)

    } catch (error) {
        res.send(error.message)
    }

})

//DELETE
router.delete('/:id', [auth,validId], async (req, res) => {
    const counter = await Counter.findByIdAndDelete(req.params.id)




    if (!counter) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(counter)
})

module.exports=router