"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const mongoose_1 = __importDefault(require("mongoose"));
const studentSchema = new mongoose_1.default.Schema({
    /*
    with _id the object in the DB and the object in the code will have the same id
    */
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    }
});
module.exports = mongoose_1.default.model('Student', studentSchema);
//# sourceMappingURL=student_model.js.map