const express=require('express')
const path = require("path");
const cors=require('cors')
const error=require('../middleware/error')

const swaggerJSDoc=require('swagger-jsdoc')
const swaggerUI=require('swagger-ui-express')

const mediaRouter=require('../routes/media')
const userRouter=require('../routes/user')
const authRouter=require('../routes/auth')
const carRouter=require('../routes/car')
const bannerRouter=require('../routes/banner')
const newsRouter=require('../routes/news')
const aboutRouter=require('../routes/about')
const serviceRouter=require('../routes/service')
const contactRouter=require('../routes/contact')
const tgBotRouter=require('../routes/tgBot')
const counterRouter = require('../routes/counter')
const mapRouter = require('../routes/map')
const orderRouter = require('../routes/order')




module.exports=(app)=>{
    const imagesFolderPath=path.join(__dirname,'..')

    const options={
        definition:{
            openapi:'3.0.0',
            info:{
                title: 'Fotonmotor backend',
                version:'1.0.0'
            },
            servers:[
                {
                    url:`http://localhost:${process.env.PORT}`
                }
            ]
        },
        apis:['./routes/*.js']
    }

    const swaggerSpec=swaggerJSDoc(options)


    app.use(cors())
    app.use('/api/',express.static(imagesFolderPath))
    app.use(express.json())
    app.use('/api/swagger',swaggerUI.serve,swaggerUI.setup(swaggerSpec))
    app.use('/api/user',userRouter)
    app.use('/api/auth',authRouter)
    app.use('/api/medias',mediaRouter)
    app.use('/api/car',carRouter)
    app.use('/api/banner',bannerRouter)
    app.use('/api/news',newsRouter)
    app.use('/api/about',aboutRouter)
    app.use('/api/service',serviceRouter)
    app.use('/api/contact',contactRouter)
    app.use('/api/tgBot',tgBotRouter)
    app.use('/api/counter', counterRouter)
    app.use('/api/map', mapRouter)
    app.use('/api/order', orderRouter)

    app.use(error)
}