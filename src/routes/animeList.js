const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const FavoriteAnime = require('../models/favoriteAnimeModel')
const verifyAccessToken = require("../middleware/verifyAccessToken")

router.get("/me/favorites", verifyAccessToken, async(req, res) => {
    try {
        const user = req.user
        if(!user) {
            return res.status(404).json({message: "JWT ERROR"})
        }
        const favoriteList = await FavoriteAnime.find({userLogin: user.login})
        res.json(favoriteList)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
router.post("/me/favorites", verifyAccessToken, async(req, res) => {
    try {
        const user = req.user
        const { animeId, genres, cover, image, title, releaseDate } = req.body
        console.log(user);
        if(!user) {
            return res.status(404).json({message: "JWT ERROR"})
        }
        const isAnimeInList = await FavoriteAnime.findOne({userLogin: user.login, animeId})
        if(isAnimeInList) {
            return res.status(400).json({message: "Anime already in User list"})
        }
    
        const newFavoriteList = new FavoriteAnime({
            animeId,
            genres, 
            cover,
            image,
            title,
            releaseDate,
            userLogin: user.login
        })
        await newFavoriteList.save()
        res.json(newFavoriteList)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.delete("/me/favorites/:animeId", verifyAccessToken, async(req, res) => {
    try {
        const user = req.user
        if(!user) {
            return res.status(400).json({message:"JWT ERROR"})
        }
        const isAnimeInList = await FavoriteAnime.findOne({animeId: req.params.animeId})
        if(!isAnimeInList) {
            return res.status(404).json(`Anime with id '${req.params.animeId}' not found in user '${user.login}' lists`)
        }
        const newFavoriteList = await FavoriteAnime.findOneAndDelete({animeId: req.params.animeId}, {new: true})
        // const newFavoriteList = await FavoriteAnime.find()
        // newFavoriteList.save()
        res.json(newFavoriteList)
    } catch (error) {
        res.status(500).json({message: error.message})
    }

})

module.exports = router