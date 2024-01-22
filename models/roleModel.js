const mongoose = require('mongoose')

const roleSchema = new mongoose.Schema({
    value: {
        type: String,
        unique: true,
        required: true,
        default: "USER"
    }
})

module.exports = mongoose.model('Role', roleSchema)