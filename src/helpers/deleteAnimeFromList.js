const deleteAnimeFromList = async(req, res, model) => {
    try {
        const user = req.user
        if(!user) {
            return res.status(401).json({message:"JWT ERROR"})
        }
        const isAnimeInList = await model.findOne({animeId: req.params.animeId})
        if(!isAnimeInList) {
            return res.status(404).json(`Anime with id '${req.params.animeId}' not found in user '${user.login}' lists`)
        }
        await model.findOneAndDelete({animeId: req.params.animeId})
        const newFavoriteList = await model.find({userLogin: user.login})
        // const newFavoriteList = await model.find()
        // newFavoriteList.save()
        return res.json(newFavoriteList)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

module.exports = deleteAnimeFromList