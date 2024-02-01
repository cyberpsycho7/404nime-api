const User = require("../models/userModel")

const getAnimeFromList = async(login, res, model) => {
    try {
        const user = await User.exists({login})
        
        if(!user) {
            return res.status(404).json({message: `User '${login}' not found`})
        }
        const list = await model.find({userLogin: login})
        return res.json(list)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

module.exports = getAnimeFromList