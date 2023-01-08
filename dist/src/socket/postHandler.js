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
const post_1 = __importDefault(require("../controllers/post"));
const Request_1 = __importDefault(require("../common/Request"));
module.exports = (io, socket) => {
    const getAllPosts = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("getAllPosts handler");
        try {
            const res = yield post_1.default.getAllPostsEvent();
            socket.emit('post:get_all', res);
        }
        catch (err) {
            socket.emit('post:get_all', { 'status': 'fail' });
        }
    });
    //payload is what we got from the event
    const getPostById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const res = yield post_1.default.getPostById(new Request_1.default(payload, socket.data.user, payload));
            socket.emit('post:get_by_id.response', res);
        }
        catch (err) {
            socket.emit('post:get_by_id.response', { 'status': 'fail' });
        }
    });
    const addNewPost = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("addNewPost handler");
        try {
            const res = yield post_1.default.addNewPost(new Request_1.default(payload, socket.data.user));
            socket.emit('post:post.response', res);
        }
        catch (err) {
            socket.emit('post:post.response', { 'status': 'fail' });
        }
    });
    const getPostBySender = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("getPostBySender handler");
        try {
            const res = yield post_1.default.getAllPosts(new Request_1.default(payload, socket.data.user, null, payload));
            socket.emit('post:get_post_by_sender.response', res);
        }
        catch (err) {
            socket.emit('post:get_post_by_sender.response', { 'status': 'fail' });
        }
    });
    const putPostById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("putPostById handler");
        try {
            const res = yield post_1.default.putPostById(new Request_1.default(payload, socket.data.user, payload, payload));
            socket.emit('post:put_post_by_id.response', res);
        }
        catch (err) {
            socket.emit('post:put_post_by_id.response', { 'status': 'fail' });
        }
    });
    console.log('register echo handlers');
    socket.on("post:get_all", getAllPosts);
    socket.on("post:get_by_id", getPostById);
    socket.on("post:post", addNewPost);
    socket.on("post:get_post_by_sender", getPostBySender);
    socket.on("post:put_post_by_id", putPostById);
};
//# sourceMappingURL=postHandler.js.map