const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const FavoriteAnime = require('../models/favoriteAnimeModel')

router.get("/:id/favorites", (req, res) => {
    res.send(`${req.params.id} WORKED`)
})
router.post("/:login/favorites", async(req, res) => {
    const user = await User.findOne({login: req.params.login})
    const { animeId, genres, cover, image, title, releaseDate } = req.body
    if(!user) {
        return res.status(404).json({message: "User not find, 404"})
    }
    const isAnimeInList = await FavoriteAnime.findOne({userLogin: user.login, animeId})
    if(isAnimeInList) {
        return res.status(400).json({message: "Anime already in User list"})
    }
    
    try {
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

module.exports = router