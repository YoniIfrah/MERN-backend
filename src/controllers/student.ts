
import {ObjectId} from 'mongodb'
import Student from '../models/student_model'
import { Request, Response } from 'express'

/**
 * takes id and convert it to Object ID for mongo fb
 * @param id string
 * @returns 
 */
const idToObjectId = (id:string) =>{
    let objectId:  ObjectId | null = null;
    try {
      objectId = new ObjectId(id);
      console.log(objectId)
    } catch (err) {
      console.error('Invalid ObjectID:', err.message);
    }
    return objectId
}
//====================================================
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
export = { getAllStudents, getStudentById, addNewStudent, getStudentsByEmail, deleteById}
