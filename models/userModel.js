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
        default: "https://i.pinimg.com/564x/4b/2e/02/4b2e0231a18413945ece04c8d235079f.jpg"
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