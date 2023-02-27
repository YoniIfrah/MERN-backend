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
const fs_1 = __importDefault(require("mz/fs"));
const unitTestVar_1 = require("../services/unitTestVar");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('beforeAll');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('afterAll');
    mongoose_1.default.connection.close();
}));
jest.setTimeout(30000);
describe("File Tests", () => {
    test("upload file", () => __awaiter(void 0, void 0, void 0, function* () {
        const filePath = `${__dirname}/avatar.png`;
        const rs = yield fs_1.default.exists(filePath);
        if (rs) {
            const response = yield (0, supertest_1.default)(server_1.default)
                .post("/file/file?file=123.jpeg").attach('file', filePath);
            expect(response.statusCode).toEqual(200);
        }
    }));
    test("update file by email", () => __awaiter(void 0, void 0, void 0, function* () {
        const userEmail = 'user1@gmail.com';
        const filePath = `${__dirname}/ava.png`;
        const rs = yield fs_1.default.exists(filePath);
        if (rs) {
            const response = yield (0, supertest_1.default)(server_1.default)
                .put(`/file/file/${userEmail}`).attach('file', filePath);
            expect(response.statusCode).toEqual(200);
        }
    }));
    test.skip("update file by id", () => __awaiter(void 0, void 0, void 0, function* () {
        // // TODO: need to change every unit test the id - done
        // const userId = '63fba585b63ccbce16b24761'
        const userId = unitTestVar_1.StudentId.getStudenId();
        const filePath = `randomPath`;
        const rs = yield fs_1.default.exists(filePath);
        if (rs) {
            const response = yield (0, supertest_1.default)(server_1.default)
                .put(`/file/file/id/${userId}`).attach('file', filePath);
            expect(response.statusCode).toEqual(200);
            expect(response.body.avatarUrl).toEqual(filePath);
        }
    }));
});
//# sourceMappingURL=file.test.js.map