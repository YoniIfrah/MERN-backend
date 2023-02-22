"use strict";
/**
* @swagger
* tags:
*   name: File
*   description: Files upload
*/
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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
// const base = 'http://192.168.0.117:3000'//home
const base = 'http://10.200.201.33:3000'; //sce
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log('multer storage callback');
        const date = `${new Date().getFullYear()}_${new Date().getMonth() + 1}_${new Date().getDate()}_${new Date().getHours()}_${new Date().getMinutes()}_${new Date().getSeconds()}`;
        cb(null, date + '.jpg'); //Appending .jpg
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.post('/file', upload.single("file"), function (req, res) {
    console.log("router.post(/file: " + base + '/' + req.file.path);
    res.status(200).send({ url: base + '/' + req.file.path });
});
const user_model_1 = __importDefault(require("../models/user_model"));
router.put(`/file/:email`, upload.single("file"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //passed unit test
        const email = req.params.email;
        const ImgUrl = req.body.ImgUrl;
        console.log("update file");
        try {
            const user = yield user_model_1.default.findOne({ 'email': email });
            console.log('user found');
            if (user == null) {
                console.log('invalid user');
            }
            const result = yield user_model_1.default.updateOne({ email: email }, { $set: { ImgUrl: ImgUrl } });
            console.log(`Updated ${result.modifiedCount} user(s).`);
            res.status(200).send(ImgUrl);
        }
        catch (error) {
            console.log("file put method err:", error);
            res.status(400);
        }
    });
});
module.exports = router;
//# sourceMappingURL=file_route.js.map