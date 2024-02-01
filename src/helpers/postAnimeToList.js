const postAnimeToList = async(req, res, model) => {
    try {
        const user = req.user
        const { animeId, genres, cover, image, title, releaseDate, type } = req.body
        console.log(user);
        if(!user) {
            return res.status(401).json({message: "JWT ERROR"})
        }
        const isAnimeInList = await model.findOne({userLogin: user.login, animeId})
        if(isAnimeInList) {
            return res.status(400).json({message: "Anime already in User list"})
        }
    
        const newList = new model({
            animeId,
            genres, 
            cover,
            image,
            title,
            releaseDate,
            type,
            userLogin: user.login
        })
        await newList.save()
        return res.json(newList)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = postAnimeToList