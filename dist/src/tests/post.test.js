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
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post_model"));
const newPostMessage = 'this is a new post message';
const newPostSender = '999000';
let newPostId = ''; //defualt value
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield post_model_1.default.remove();
    mongoose_1.default.connection.close();
}));
describe('Posts Tests', () => {
    test('add new post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).post('/post').send({
            'message': newPostMessage,
            'sender': newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
        newPostId = response.body._id;
        console.log(newPostId);
    }));
    test('get all post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post');
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].message).toEqual(newPostMessage);
        expect(response.body[0].sender).toEqual(newPostSender);
    }));
    test('get post by Id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post/' + newPostId).send({
            'message': newPostMessage,
            'sender': newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(newPostMessage);
        expect(response.body.sender).toEqual(newPostSender);
        expect(response.body._id).toEqual(newPostId);
    }));
    test('get post by sender', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(server_1.default).get('/post?=' + newPostSender).send({
            'message': newPostMessage,
            'sender': newPostSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body[0].message).toEqual(newPostMessage);
        expect(response.body[0].sender).toEqual(newPostSender);
        expect(response.body[0]._id).toEqual(newPostId);
    }));
    test('put post by id', () => __awaiter(void 0, void 0, void 0, function* () {
        const putMsg = 'message from put request';
        const putSender = '111000';
        console.log(newPostId);
        const response = yield (0, supertest_1.default)(server_1.default).put('/post/' + newPostId).send({
            'message': putMsg,
            'sender': putSender
        });
        expect(response.statusCode).toEqual(200);
        expect(response.body.message).toEqual(putMsg);
        expect(response.body.sender).toEqual(putSender);
        expect(response.body._id).toEqual(newPostId);
        expect(response.body.message).not.toEqual(newPostMessage);
        expect(response.body.sender).not.toEqual(newPostSender);
        //trying with invalid id
        const response2 = yield (0, supertest_1.default)(server_1.default).put('/post/' + '0').send({
            'message': 'invalid',
            'sender': 'invalid'
        });
        expect(response2.statusCode).toEqual(400);
    }));
});
//# sourceMappingURL=post.test.js.map