"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const router = express_1.default.Router();
/**
* @swagger
* tags:
*   name: Auth
*   description: The Authentication API
*/
router.post('/register', auth_1.default.register);
router.post('/login', auth_1.default.login);
router.get('/refresh', auth_1.default.refresh);
router.get('/logout', auth_1.default.logout);
module.exports = router;
//# sourceMappingURL=auth_route.js.map