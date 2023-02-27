
import {ObjectId} from 'mongodb'
import Student from '../models/student_model'
import { Request, Response } from 'express'
import {idToObjectId} from '../services/helpers'

const getAllStudents = async (req: Request, res: Response) => {
    console.log('getAllStudents')

    try {
        let students = {}
        students = await Student.find()
        res.status(200).send(students)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" })
    }
}

const getStudentById = async (req: Request, res: Response) => {
    console.log('getStudentById()')
    console.log(req.params.id)
    let objectId:  ObjectId | null = null;
    try {
      objectId = new ObjectId(req.params.id);
      console.log(objectId)
    } catch (err) {
      console.error('Invalid ObjectID:', err.message);
    }
    try {
        const students = await Student.findOne({ _id: objectId })
        res.status(200).send(students)
    } catch (err) {
        console.log(err.message)
        res.status(400).send({ 'error': "fail to get posts from db" })
    }
}


const addNewStudent = async (req: Request, res: Response) => {
    console.log(req.body)

    const student = new Student({
        email: req.body.email,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
    })

    try {
        const newStudent = await student.save()
        console.log("save student in db")
        res.status(200).send(newStudent)
    } catch (err) {
        console.log("fail to save student in db " + err)
        res.status(400).send({ 'error': 'fail adding new post to db' })
    }
}

const getStudentsByEmail = async (req: Request, res: Response) => {
    console.log('getStudentsByEmail()')
    const email = req.params.email
    try {
        const studentsByEmail = await Student.find({email:email})
        console.log("studentsByEmail  ",studentsByEmail)
        res.status(200).send(studentsByEmail)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db by email" })
    }
}


const deleteById = async (req: Request, res: Response) => {
    console.log('deleteById()')
    console.log(req.params.id)
    const objectId:ObjectId | null = idToObjectId(req.params.id)
    try {
        const del = await Student.findByIdAndDelete({ _id: objectId })
        res.status(200).send(del)
    }catch (error) {
        res.status(400).send({ 'error': "fail to delete post from db by ID" })
    }
}

const putById = async (req: Request, res: Response) => {
    console.log('deleteById()')
    console.log(req.params.id)
    const text = req.body.text;
    console.log("text = ",text)

    const objectId:ObjectId | null = idToObjectId(req.params.id)
    try {
        const result = await Student.updateOne(
            { _id: objectId },
            { $set: { name: text } }
        )
        console.log(`Updated ${result.modifiedCount} student(s).`);
        const student = await Student.findOne({ _id: objectId })
        if(student == null){
            console.log('invalid user')
        }
        res.status(200).send(student)
    } catch (err) {
        console.log(err.message)
        res.status(400).send({ 'error': "fail to change name to student in db" })
    }

}
 const updatedImg = async (req: Request, res: Response) => {
    console.log('updatedImg()')
    console.log(req.params.id)
    const image = req.body.image;
    console.log("image = ",image)

    const objectId:ObjectId | null = idToObjectId(req.params.id)
    try {
        const result = await Student.updateOne(
            { _id: objectId },
            { $set: { avatarUrl: image } }
        )
        console.log(`Updated ${result.modifiedCount} student(s).`);
        const student = await Student.findOne({ _id: objectId })
        if(student == null){
            console.log('invalid user')
        }
        res.status(200).send(student)
    } catch (err) {
        console.log(err.message)
        res.status(400).send({ 'error': "fail to change name to student in db" })
    }
}

export = { updatedImg, getAllStudents, getStudentById, addNewStudent, getStudentsByEmail, deleteById, putById}
