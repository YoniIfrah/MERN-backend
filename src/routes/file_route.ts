/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/

import express, { Request, Response } from 'express'
const router = express.Router()

import multer from 'multer'

// const base = 'http://192.168.0.117:3000'//home
const base = 'http://10.200.201.204:3000'//sce
// const base = 'http://10.0.0.28:3000'//zamir


const storage = multer.diskStorage({
    destination: function (req: Request, file: unknown, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        console.log('multer storage callback')
        const date = `${new Date().getFullYear()}_${new Date().getMonth() + 1}_${new Date().getDate()}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`

        cb(null, date + '.jpg') //Appending .jpg
    }
})

const upload = multer({ storage: storage });

router.post('/file', upload.single("file"), function (req: Request, res: Response) {
    console.log("router.post(/file: " + base +'/'+ req.file.path)
    
    res.status(200).send({ url: base+'/'+ req.file.path })
});


import User from '../models/user_model'
router.put(`/file/:email`, upload.single("file"), async function (req: Request, res: Response) {
    //passed unit test
    const email = req.params.email;
    const ImgUrl = req.body.ImgUrl;
    console.log("update file")

    try {
        const user = await User.findOne({'email': email})
        console.log('user found')
        if(user == null){
            console.log('invalid user')
        }
        const result = await User.updateOne(
            {email: email}, 
            { $set: { ImgUrl: ImgUrl } }
        )
            console.log(`Updated ${result.modifiedCount} user(s).`);

            res.status(200).send(ImgUrl)
        } catch (error) {

            console.log("file put method err:", error)
            res.status(400)             
        }
});


export = router