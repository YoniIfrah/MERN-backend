
import Student from '../models/student_model'
import { Request, Response } from 'express'



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
    // console.log(req.params.id)
    try {
        const students = await Student.findById(req.params.id)
        res.status(200).send(students)
    } catch (err) {
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
    const email = req.params.email
    try {
        const studentsByEmail = await Student.find({email:email})
        console.log("studentsByEmail  ",studentsByEmail)
        res.status(200).send(studentsByEmail)
    } catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db by email" })
    }
}

export = { getAllStudents, getStudentById, addNewStudent, getStudentsByEmail}
