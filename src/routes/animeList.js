const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const FavoriteAnime = require('../models/favoriteAnimeModel')
const ToWatchAnime = require(`../models/toWatchAnimeModel`)
const WatchedAnime = require(`../models/watchedAnimeModel`)
const verifyAccessToken = require("../middleware/verifyAccessToken")
const getAnimeFromList = require('../helpers/getAnimeFromList')
const postAnimeToList = require('../helpers/postAnimeToList')
const deleteAnimeFromList = require('../helpers/deleteAnimeFromList')

router.get("/:login/favorites", async(req, res) => {
    getAnimeFromList(req.params.login, res, FavoriteAnime)

})
router.post("/me/favorites", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, FavoriteAnime)
})

router.delete("/me/favorites/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, FavoriteAnime)
})

//TO WATCH ROUTES
router.get("/:login/to-watch", verifyAccessToken, async(req, res) => {
    getAnimeFromList(req.params.login, res, ToWatchAnime)

})
router.post("/me/to-watch", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, ToWatchAnime)
})

router.delete("/me/to-watch/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, ToWatchAnime)
})

//WATCHED
router.get("/:login/watched", verifyAccessToken, async(req, res) => {
    getAnimeFromList(req.params.login, res, WatchedAnime)

})
router.post("/me/watched", verifyAccessToken, async(req, res) => {
    postAnimeToList(req, res, WatchedAnime)
})

router.delete("/me/watched/:animeId", verifyAccessToken, async(req, res) => {
    deleteAnimeFromList(req, res, WatchedAnime)
})

module.exports = router