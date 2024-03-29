"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongodb_1 = require("mongodb");
const student_model_1 = __importDefault(require("../models/student_model"));
const helpers_1 = require("../services/helpers");
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getAllStudents');
    try {
        let students = {};
        students = yield student_model_1.default.find();
        res.status(200).send(students);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db" });
    }
});
const getStudentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getStudentById()');
    console.log(req.params.id);
    let objectId = null;
    try {
        objectId = new mongodb_1.ObjectId(req.params.id);
        console.log(objectId);
    }
    catch (err) {
        console.error('Invalid ObjectID:', err.message);
    }
    try {
        const students = yield student_model_1.default.findOne({ _id: objectId });
        res.status(200).send(students);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ 'error': "fail to get posts from db" });
    }
});
const addNewStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const student = new student_model_1.default({
        email: req.body.email,
        name: req.body.name,
        avatarUrl: req.body.avatarUrl,
    });
    try {
        const newStudent = yield student.save();
        console.log("save student in db");
        res.status(200).send(newStudent);
    }
    catch (err) {
        console.log("fail to save student in db " + err);
        res.status(400).send({ 'error': 'fail adding new post to db' });
    }
});
const getStudentsByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getStudentsByEmail()');
    const email = req.params.email;
    try {
        const studentsByEmail = yield student_model_1.default.find({ email: email });
        console.log("studentsByEmail  ", studentsByEmail);
        res.status(200).send(studentsByEmail);
    }
    catch (err) {
        res.status(400).send({ 'error': "fail to get posts from db by email" });
    }
});
const deleteById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('deleteById()');
    console.log(req.params.id);
    const objectId = (0, helpers_1.idToObjectId)(req.params.id);
    try {
        const del = yield student_model_1.default.findByIdAndDelete({ _id: objectId });
        res.status(200).send(del);
    }
    catch (error) {
        res.status(400).send({ 'error': "fail to delete post from db by ID" });
    }
});
const putById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('deleteById()');
    console.log(req.params.id);
    const text = req.body.text;
    console.log("text = ", text);
    const objectId = (0, helpers_1.idToObjectId)(req.params.id);
    try {
        const result = yield student_model_1.default.updateOne({ _id: objectId }, { $set: { name: text } });
        console.log(`Updated ${result.modifiedCount} student(s).`);
        const student = yield student_model_1.default.findOne({ _id: objectId });
        if (student == null) {
            console.log('invalid user');
        }
        res.status(200).send(student);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ 'error': "fail to change name to student in db" });
    }
});
const updatedImg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('updatedImg()');
    console.log(req.params.id);
    const image = req.body.image;
    console.log("image = ", image);
    const objectId = (0, helpers_1.idToObjectId)(req.params.id);
    try {
        const result = yield student_model_1.default.updateOne({ _id: objectId }, { $set: { avatarUrl: image } });
        console.log(`Updated ${result.modifiedCount} student(s).`);
        const student = yield student_model_1.default.findOne({ _id: objectId });
        if (student == null) {
            console.log('invalid user');
        }
        res.status(200).send(student);
    }
    catch (err) {
        console.log(err.message);
        res.status(400).send({ 'error': "fail to change name to student in db" });
    }
});
module.exports = { updatedImg, getAllStudents, getStudentById, addNewStudent, getStudentsByEmail, deleteById, putById };
//# sourceMappingURL=student.js.map