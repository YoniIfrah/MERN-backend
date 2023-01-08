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
const message_model_1 = __importDefault(require("../models/message_model"));
module.exports = (io, socket) => {
    // {'to': destination user id,
    //   'message' : message to send}
    const sendMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new message_model_1.default({
            message: payload.message,
            sender: payload.from,
            reciver: payload.to
        });
        try {
            const newMessage = yield message.save();
            console.log("saved message successfully:", newMessage);
            io.to(message.reciver).emit("chat:message", {
                'to': message.reciver, 'from': message.sender, 'message': message.message
            });
        }
        catch (error) {
            socket.emit("chat:message", { status: "fail" });
        }
    });
    const getAllMessageById = (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('chat:get all msgs by id');
        let messages = {};
        try {
            const senderMessages = yield message_model_1.default.find({ sender: payload.sender });
            const receiverMessages = yield message_model_1.default.find({ reciver: payload.sender });
            messages = senderMessages.concat(receiverMessages);
            io.to(socket.data.user).emit("chat:get_all_messages_by_id", messages);
        }
        catch (error) {
            socket.emit("chat:get_all_messages_by_id", { status: "fail" });
        }
    });
    console.log('register chat handlers');
    socket.on("chat:send_message", sendMessage);
    socket.on("chat:get_all_messages_by_id", getAllMessageById);
};
//# sourceMappingURL=chatHandler.js.map