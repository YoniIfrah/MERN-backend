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
const Error_1 = __importDefault(require("../common/Error"));
const Response_1 = __importDefault(require("../common/Response"));
const post_model_1 = __importDefault(require("../models/post_model"));
const getAllPostsEvent = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Entered getAllPostsEvent");
    try {
        const posts = yield post_model_1.default.find();
        return { status: 'OK', data: posts };
    }
    catch (err) {
        return { status: 'FAIL', data: "" };
    }
});
const getAllPosts = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let posts = {};
        if (req.query.sender == null || req.query == null) {
            posts = yield post_model_1.default.find();
        }
        else {
            posts = yield post_model_1.default.find({ 'sender': req.query.sender });
        }
        return new Response_1.default(posts);
    }
    catch (error) {
        console.log("fail to get posts in db");
        return new Response_1.default(null, null, null, new Error_1.default(400, error.message));
    }
});
const addNewPost = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("this is the request body: ", req.body);
    const post = new post_model_1.default({
        message: req.body.message,
        sender: req.body.sender
    });
    try {
        const newPost = yield post.save();
        return new Response_1.default(newPost, req.userId);
    }
    catch (error) {
        return new Response_1.default(null, post.sender, null, new Error_1.default(400, error.message));
    }
});
const getPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log('getPostById: ', id);
    if (id == '12345') {
        console.log('stoping test');
    }
    if (id == null || id == undefined) {
        return new Response_1.default(null, null, null, new Error_1.default(400, 'null or undifined id'));
    }
    try {
        const posts = yield post_model_1.default.findById(id);
        return new Response_1.default(posts, id);
    }
    catch (error) {
        return new Response_1.default(null, null, null, new Error_1.default(400, error.message));
    }
});
const putPostById = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log('putPostById: ', id);
    if (id == null || id == undefined) {
        return new Response_1.default(null, id, new Error_1.default(400, 'id is null or undefined'));
    }
    try {
        const posts = yield post_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true
        });
        return new Response_1.default(posts, id);
    }
    catch (error) {
        return new Response_1.default(null, null, null, new Error_1.default(400, error.message));
    }
});
module.exports = { getAllPosts, addNewPost, getPostById, putPostById, getAllPostsEvent };
//# sourceMappingURL=post.js.map