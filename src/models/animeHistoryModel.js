const mongoose = require('mongoose')

const animeHistorySchema = new mongoose.Schema({
    animeId: {
        type: String,
        required: true
    },
    userId: {
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
    lastEpisode: {
        type: Number,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('AnimeHistory', animeHistorySchema)