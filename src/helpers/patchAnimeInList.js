const patchAnimeInList = async(req, res, model) => {
    try {
        const user = req.user
        const {lastEpisode, time} = req.body
        let update = {}
        if(!user) {
            return res.status(401).json({message:"JWT ERROR"})
        }
        const isAnimeInList = await model.findOne({userId: user.id, animeId: req.params.animeId})
        if(!isAnimeInList) {
            return res.status(404).json(`Anime with id '${req.params.animeId}' not found in user '${user.id}' lists`)
        }
        if(lastEpisode != null) {
            update.lastEpisode = lastEpisode
        }
        if(time != null) {
            update.time = time
        }
        const updatedAnime = await model.findOneAndUpdate({userId: user.id, animeId: req.params.animeId}, update, {new: true})
        // const newFavoriteList = await model.find()
        // newFavoriteList.save()
        return res.json(updatedAnime)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

}

module.exports = patchAnimeInList