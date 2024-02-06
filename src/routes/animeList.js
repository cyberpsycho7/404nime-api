const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const FavoriteAnime = require('../models/favoriteAnimeModel')
const ToWatchAnime = require(`../models/toWatchAnimeModel`)
const WatchedAnime = require(`../models/watchedAnimeModel`)
const AnimeHistory = require(`../models/animeHistoryModel`)
const verifyAccessToken = require("../middleware/verifyAccessToken")
const getAnimeFromList = require('../helpers/getAnimeFromList')
const postAnimeToList = require('../helpers/postAnimeToList')
const deleteAnimeFromList = require('../helpers/deleteAnimeFromList')
const patchAnimeInList = require('../helpers/patchAnimeInList')

router.get("/:id/favorites", async(req, res) => {
    getAnimeFromList(req.params.id, res, FavoriteAnime)

})
router.post("/me/favorites", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, FavoriteAnime)
})

router.delete("/me/favorites/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, FavoriteAnime)
})

//TO WATCH ROUTES
router.get("/:id/to-watch", async(req, res) => {
    getAnimeFromList(req.params.id, res, ToWatchAnime)

})
router.post("/me/to-watch", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, ToWatchAnime)
})

router.delete("/me/to-watch/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, ToWatchAnime)
})

//WATCHED
router.get("/:id/watched", async(req, res) => {
    getAnimeFromList(req.params.id, res, WatchedAnime)

})
router.post("/me/watched", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, WatchedAnime)
})
router.delete("/me/watched/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, WatchedAnime)
})

//history
router.get("/:id/anime-history", async(req, res) => {
    getAnimeFromList(req.params.id, res, AnimeHistory)
})
router.post("/me/anime-history", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, AnimeHistory, true)
})
router.delete("/me/anime-history/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, AnimeHistory)
})
router.patch("/me/anime-history/:animeId", verifyAccessToken, async(req, res) => {
    patchAnimeInList(req, res, AnimeHistory)
})

module.exports = router