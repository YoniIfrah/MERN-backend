import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
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
})

export = mongoose.model('Student', studentSchema)