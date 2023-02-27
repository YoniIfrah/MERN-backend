"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idToObjectId = void 0;
const mongodb_1 = require("mongodb");
/**
 * takes id and convert it to Object ID for mongo fb
 * @param id string
 * @returns
 */
const idToObjectId = (id) => {
    let objectId = null;
    try {
        objectId = new mongodb_1.ObjectId(id);
        console.log(objectId);
    }
    catch (err) {
        console.error('Invalid ObjectID:', err.message);
    }
    return objectId;
};
exports.idToObjectId = idToObjectId;
//# sourceMappingURL=helpers.js.map