const mongoose = require('mongoose')

const toWatchAnimeSchema = new mongoose.Schema({
    animeId: {
        type: String,
        required: true
    },
    userLogin: {
        type: String,
        required: true
    },
    cover: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    title: {
        type: Object,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    type: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('ToWatchAnime', toWatchAnimeSchema)