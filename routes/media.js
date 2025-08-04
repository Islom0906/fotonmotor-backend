const express=require('express')
const router=express.Router()
const multer=require('multer')
const {v4:uuidv4}=require('uuid')
const auth=require('../middleware/auth')
const {Media: Media}=require('../model/mediaSchema')
const deleteMedias=require('../utils/deleteMedias')
const path=require('path')



const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'media/')
    },filename:(req,file,cb)=>{
        const ext=path.extname(file.originalname)
        cb(null,uuidv4()+ext)
    }
})

const fileFilter = (req,file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg','video/mp4','application/pdf'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        const error='Invalid file type. Only JPG, JPEG, PNG media, Video MP4 and PDF are allowed.'
        cb(error);
    }
};

const upload=multer({storage:storage,fileFilter:fileFilter})

// GET
router.get('/',async (req,res)=>{
    const medias=await Media.find()
    res.send(medias)
})

// POST
router.post('/',[auth,upload.array('media',10)],async (req,res)=>{


    if (!req.files || req.files.length===0){
        return res.status(400).send('Iltimos rasm yuklang')
    }

    try {
        const uploadedFiles=req.files.map((file)=>({
            name:file.filename,
            path:file.path
        }))
        const savedMedia=await Media.create(uploadedFiles)
        res.send(savedMedia)
    }catch (err){
        console.error('Error saving media to MongoDB:', err);
        res.status(500).send('Error saving media to MongoDB.');
    }

})

router.delete('/',auth,async (req,res)=>{
    let medias=[]
    await Media.find({_id: {$in: req.body.ids}})
        .then((documents) => {
            medias = documents
        })
        .catch((err) => {
            res.send(err.message)
        });

    await Media.deleteMany({_id: {$in: req.body.ids}})
        .then((result) => {
            res.send(result)
        })
        .catch((error) => {
            res.send(error.message)
        });

    await deleteMedias(medias)


})

module.exports=router