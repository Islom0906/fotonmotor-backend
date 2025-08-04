const express=require('express')
const router=express.Router()
const {Contact,validate}=require('../model/contactSchema')
const validId=require('../middleware/validId')
const auth=require('../middleware/auth')

// GET
router.get('/', async (req, res) => {
    try {
        const contact = await Contact.find()
        res.send(contact[0])
    } catch (error) {
        res.sendStatus(500).send(error)
    }
})
// GET ID
router.get('/:id', async (req, res) => {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(contact)
})

// POST
router.post('/',auth,async (req, res) => {
    const {error} = validate(req.body)

    if (error) {
        return res.status(400).send(error.details[0].message)
    }
    try {
        const contact = await Contact.create(req.body)

        res.status(201).send(contact)

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

    try{
        const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {new: true})


        if (!contact){
            return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
        }

        res.send(contact)
    }catch (error){
        res.send(error.message)
    }

})

//DELETE

router.delete('/:id', [auth,validId], async (req, res) => {
    const contact = await Contact.findByIdAndDelete(req.params.id)

    if (!contact) {
        return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(contact)
})

module.exports = router