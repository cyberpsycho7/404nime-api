const User = require("../models/userModel")

const getAnimeFromList = async(id, res, model) => {
    try {
        const user = await User.exists({_id: id})
        console.log(user);
        
        if(!user) {
            return res.status(404).json({message: `User with id '${id}' not found`})
        }
        const list = await model.find({userId: id})
        return res.json(list)
    } catch (error) {
        console.log("ERRO HERE");
        return res.status(500).json({message: error.message})
    }
}

module.exports = getAnimeFromList