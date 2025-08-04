const express = require('express')
const router = express.Router()
const {Order, validate} = require('../model/orderSchema')
const validId = require('../middleware/validId')
const {TgBot} = require("../model/tgBotSchema");
const bot = require("../utils/telegramBot");
const auth = require('../middleware/auth')


const sendMessageBot=(text)=>{

    const htmlMessage= `
<strong>Заказ машина</strong>

<strong>Модель</strong>: ${text?.model}
<strong>Имя</strong>: <code>${text?.userName}</code>
<strong>Тел</strong>: ${text?.phone}
`
    return htmlMessage

}

router.get('/', auth,async (req, res) => {
    const order = await Order.find()


    res.send(order)
})


router.get('/:id', [auth,validId], async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (!order) {
        res.status(400).send('Berilgan ID bo\'yicha malumot topilmadi')
    }

    res.send(order)
})


router.post('/', async (req, res) => {

    const {error} = validate(req.body)
    if (error) {
        return res.status(400).send(error.details[0].message)
    }






    try {

            const order = await Order.create({
                userName:req.body.userName,
                phone:req.body.phone,
                model:req.body.model,
            })
            const chatIds = await TgBot.find()
            const errors = [];


            await Promise.all(chatIds?.map(async (chat) => {
                try {

                    if (chat?.role === 'all') {
                        await bot.sendMessage(chat?.tgId, sendMessageBot(order), {parse_mode: 'HTML'})
                    }
                    if (chat?.role === 'order') {
                        await bot.sendMessage(chat?.tgId, sendMessageBot(order), {parse_mode: 'HTML'})
                    }
                } catch (err) {
                    errors.push(err.message)
                }

            }))




            res.status(201).send(order)


    } catch (error) {
        res.send(error.message)
    }
})


// router.delete('/:id', [auth,validId], async (req, res) => {
//     const position = await Order.findByIdAndRemove(req.params.id)
//
//     if (!position) {
//         return res.status(404).send('Berilgan ID bo\'yicha malumot topilmadi')
//     }
//
// })

module.exports = router
