const postAnimeToList = async(req, res, model, isHistory=false) => {
    try {
        const user = req.user
        const { animeId, genres, cover, image, title, releaseDate, type, lastEpisode, time } = req.body
        let historyKeys = {};
        console.log(user);
        if(!user) {
            return res.status(401).json({message: "JWT ERROR"})
        }
        const isAnimeInList = await model.findOne({userId: user.id, animeId})
        if(isAnimeInList) {
            return res.status(400).json({message: "Anime already in User list"})
        }
        if(isHistory) {
            historyKeys.lastEpisode = lastEpisode
            historyKeys.time = time
        }
    
        const newList = new model({
            animeId,
            genres, 
            cover,
            image,
            title,
            releaseDate,
            type,
            userId: user.id,
            ...historyKeys
        })
        await newList.save()
        return res.json(newList)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = postAnimeToList