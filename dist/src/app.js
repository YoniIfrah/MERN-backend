"use strict";
// npm run devstart is for auto start the server after every change in the code by clicking save
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const port = process.env.PORT;
// app.get('/index', (req, res) => {
//     res.send('Hello World')
// })
server_1.default.listen(port, () => {
    console.log(`listening on port: ${port}!`);
});
//# sourceMappingURL=app.js.map