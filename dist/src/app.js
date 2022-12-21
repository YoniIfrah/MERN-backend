"use strict";
// npm run devstart is for auto start the server after every change in the code by clicking save
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const server_1 = __importDefault(require("./server"));
const socket_server_1 = __importDefault(require("./socket_server"));
(0, socket_server_1.default)(server_1.default);
const port = process.env.PORT;
// app.get('/index', (req, res) => {
//     res.send('Hello World')
// })
server_1.default.listen(port, () => {
    console.log(`listening on port: ${port}!`);
});
module.exports = server_1.default;
//# sourceMappingURL=app.js.map