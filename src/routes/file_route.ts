/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/

import express, { Request, Response } from 'express'
import { idToObjectId } from '../services/helpers'
import {ObjectId} from 'mongodb'

const router = express.Router()

import multer from 'multer'

// const base = 'http://192.168.0.117:3000'//home
const base = 'http://172.19.4.3:3000'//sce
// const base = 'http://192.168.246.174:3000' //cell phone

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
        if(user == null){
            console.log('invalid user')
        }
        console.log('user found')
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
import Student from '../models/student_model'
router.put(`/file/id/:id`, upload.single("file"), async function (req: Request, res: Response) {
    const avatarUrl = req.body.ImgUrl;
    console.log("updating file to ",req.params.id)

    try {
        const objectId: ObjectId | null = idToObjectId(req.params.id)

        let student = await Student.findOne({ _id: objectId })
        // console.log("student = ",student)
        if(student == null){
            console.log('invalid id')
        } else{
            console.log('student found')
        }

        const result = await Student.updateOne(
            { _id: objectId },
            { $set: { avatarUrl: avatarUrl } }
        )
        console.log(`Updated ${result.modifiedCount} students(s).`);
        student = await Student.findOne({ _id: objectId })
        res.status(200).send({"avatarUrl":student.avatarUrl})

        } catch (error) {

            console.log("file put method err:", error)
            res.status(400)             
        }
});


export = router