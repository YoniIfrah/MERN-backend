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
const post_model_1 = __importDefault(require("../models/post_model"));
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.query.sender == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ 'sender': req.query.sender });
        }
        posts = yield post_model_1.default.find();
        res.status(200).send(posts);
    }
    catch (error) {
        console.log("fail to get posts in db");
        res.status(400).send({ "error": error.message });
    }
});
const addNewPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is the request body: ", req.body);
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.body.sender
    });
    try {
        const newPost = yield post.save();
        console.log('save post in db');
        res.status(200).send(newPost);
    }
    catch (error) {
        console.log("fail to save post in db");
        res.status(400).send({ "error": error.message });
    }
});
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log('getPostById: ', id);
    if (id == null || id == undefined) {
        res.status(400).send({
            'status': 'fail',
            'message': 'null or undefined'
        });
    }
    try {
        const posts = yield post_model_1.default.findById(id);
        res.status(200).send(posts);
    }
    catch (error) {
        res.status(400).send({
            'status': 'fail',
            'message': error.message
        });
    }
});
const putPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log('putPostById: ', id);
    if (id == null || id == undefined) {
        res.status(400).send({
            'status': 'fail',
            'message': 'id is null or undefined',
        });
    }
    try {
        const posts = yield post_model_1.default.findByIdAndUpdate({ '_id': id }, req.body).then(() => {
            post_model_1.default.findOne({ '_id': id }).then((posts) => {
                res.status(200).send(posts);
            });
        });
    }
    catch (error) {
        res.status(400).send({
            'status': 'fail',
            'message': error.message
        });
    }
});
module.exports = { getAllPosts, addNewPost, getPostById, putPostById };
//# sourceMappingURL=post.js.map