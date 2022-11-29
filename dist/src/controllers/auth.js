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
const user_model_1 = __importDefault(require("../models/user_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Other methods
 */
function sendError(res, error) {
    res.status(400).send({
        'err': error,
    });
}
function getTokenFromReq(req) {
    const authHeader = req.headers['authorization'];
    if (authHeader == null)
        return null;
    return authHeader.split(' ')[1];
}
function generateTokens(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield jsonwebtoken_1.default.sign({ 'id': userId }, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ 'id': userId }, process.env.REFRESH_TOKEN_SECRET);
        return { 'accessToken': accessToken, 'refreshToken': refreshToken };
    });
}
// end of other methods
/**
 **explain for registration**
 1.Check if the user is valid
 2.Check if the user is not already registered
 3.Encrypt the password
 4.Save new user to the DB
 5.return response
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return sendError(res, 'please provide valid email/password');
    }
    try {
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user != null) {
            return sendError(res, 'user already exists');
        }
    }
    catch (err) {
        console.log('Error:', err);
        sendError(res, 'fail checking user');
    }
    try {
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPwd = yield bcrypt_1.default.hash(password, salt);
        let newUser = new user_model_1.default({
            'email': email,
            'password': encryptedPwd
        });
        newUser = yield newUser.save();
        res.status(200).send(newUser);
    }
    catch (error) {
        console.log('Error:', error);
        sendError(res, 'fail checking user pw');
    }
});
/**
 **explain for login**
 1.Check if email and password are valid
 2.Check if the user exists in the DB
 3.Check if password match
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return sendError(res, 'please provide valid email/password');
    }
    try {
        const user = yield user_model_1.default.findOne({ 'email': email });
        if (user == null) {
            return sendError(res, 'incorrect user or password');
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return sendError(res, 'incorrect user or password');
        }
        const accessToken = yield jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.ACCESS_TOKEN_SECRET, { 'expiresIn': process.env.JWT_TOKEN_EXPIRATION });
        const refreshToken = yield jsonwebtoken_1.default.sign({ '_id': user._id }, process.env.REFRESH_TOKEN_SECRECT);
        if (user.refresh_tokens == null) {
            user.refresh_tokens = [refreshToken];
        }
        else {
            user.refresh_tokens.push(refreshToken);
        }
        yield user.save();
        // in the end of the block
        res.status(200).send({ 'accessToken': accessToken, 'refreshToken': refreshToken });
    }
    catch (err) {
        console.log('Error:', err);
        sendError(res, 'fail checking user');
    }
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = getTokenFromReq(req);
    if (refreshToken == null)
        return sendError(res, 'authentication missing');
    try {
        const user = yield jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRECT);
        const userObj = yield user_model_1.default.findById(user);
        if (!userObj)
            return sendError(res, 'fail validating token');
        if (!userObj.refresh_tokens.includes(refreshToken)) {
            userObj.refresh_tokens = [];
            yield userObj.save();
            return sendError(res, 'fail validating token');
        }
        const tokens = yield generateTokens(userObj._id.toString());
        userObj.refresh_tokens[userObj.refresh_tokens.indexOf(refreshToken)] = tokens.refreshToken;
        console.log("refresh token: " + refreshToken);
        console.log("with token: " + tokens.refreshToken);
        yield userObj.save();
        return res.status(200).send(tokens);
    }
    catch (err) {
        return sendError(res, 'validation failed token');
    }
    res.status(400).send({ 'error': 'not implemented' });
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(400).send({
        'status': 'fail',
        'message': 'not implemented'
    });
});
const authenticaticatedMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    if (authHeader == null || authHeader == undefined) {
        return sendError(res, 'authHeader is null/undefined');
    }
    const token = authHeader.split(' ')[1];
    if (token == null) {
        return sendError(res, 'auth us missing');
    }
    try {
        const user = yield jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        //@TODO: fix this
        //req.userId = user._id
        console.log("token user:", user);
        next();
    }
    catch (err) {
        return sendError(res, 'validation failed token');
    }
});
module.exports = { login, refresh, register, logout, authenticaticatedMiddleware };
//# sourceMappingURL=auth.js.map