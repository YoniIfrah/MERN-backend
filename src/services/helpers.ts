import {ObjectId} from 'mongodb'

/**
 * takes id and convert it to Object ID for mongo fb
 * @param id string
 * @returns 
 */
export const idToObjectId = (id:string) =>{
    let objectId:  ObjectId | null = null;
    try {
      objectId = new ObjectId(id);
      console.log(objectId)
    } catch (err) {
      console.error('Invalid ObjectID:', err.message);
    }
    return objectId
}
