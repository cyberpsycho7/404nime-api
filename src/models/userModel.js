const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        unique: true,
        required: true
    },
    // mail: {
    //     type: String,
    //     unique
    //     required: true
    // },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false,
        default: "https://i.pinimg.com/originals/1e/05/51/1e0551e5a7a0dba991a0f20cf5f6470d.jpg"
    },
    cover: {
        type: String,
        required: false,
        default: "https://i.pinimg.com/originals/a6/b2/56/a6b256f4640c44ed0536b8a5e2932766.jpg"
    },
    bio: {
        type: String,
        required: false,
        default: "No bio yet..."
    },

    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    roles: [{
        type: String,
        ref: 'Role'
    }]
})

module.exports = mongoose.model('User', userSchema)