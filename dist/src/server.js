"use strict";
// npm run devstart is for auto start the server after every change in the code by clicking save
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// body-parser
const body_parser_1 = __importDefault(require("body-parser"));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: '1mb' }));
app.use(body_parser_1.default.json());
//connecting to db
/**
 **if the connection to the mongoose service is missing use the following command:
 brew services start mongodb-community@6.0
 **to stop the service from running:
 brew services stop mongodb-community@6.0
 */
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.connect(process.env.DATABASE_URL); //, {useNewUrlParser: true})
const db = mongoose_1.default.connection;
db.on('error', err => { console.error(err); });
db.once('open', () => console.log('connected to mongo'));
//static pages
app.use('/public', express_1.default.static('public'));
const post_route_1 = __importDefault(require("./routes/post_route"));
app.use('/post', post_route_1.default);
module.exports = app;
//# sourceMappingURL=server.js.map