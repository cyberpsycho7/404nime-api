const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const bcrypt = require('bcryptjs')
const sharp = require('sharp');
const passwordRegEx = /^([A-Za-z0-9])([^\s]){7,16}$/
const loginRegEx = /^[A-Za-z0-9]{4,16}$/
const nameRegEx = /^.{2,16}$/
const bioRegEx = /^.{0,500}$/
const jwt = require('jsonwebtoken')
const verifyAccessToken = require("../middleware/verifyAccessToken")
const generateAccessToken = require("../helpers/generateAccessToken")
const generateRefreshToken = require("../helpers/generateRefreshToken")

const getUser = async(req, res, next) => { 
    let user;
    try {
        user = await User.findById(req.params.id)
        if(user == null) {
            return res.status(404).json({message: "404 cannot find"})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

    res.user = user
    next()
}

const optimizeImage = async(image, w, h) => {
    try {
        let arrData = `${image}`.split(',');
        let imgBuffer = Buffer.from(arrData[1], 'base64');
        let bufferImgCompressed = await sharp(imgBuffer)
        .resize({ width: w, height: h })
        .toBuffer()
        .then(data => { return data; })
        .catch(err => { 
            return false
        });
        const compressedImg =  arrData[0] + "," + bufferImgCompressed.toString('base64')
        return compressedImg
        
    } catch (error) {
        return false
    }

}

router.get('/image', async(req, res) => {
    try {
        // const user = await User.findOne({login: "touchme"})
        let image;
        res.json(arrData[0] + "," + imgBase64Compressed)
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// GET all
router.get('/', verifyAccessToken, async(req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.get('/:login', async(req, res) => {
    try {
        const {login} = req.params

        const user = await User.findOne({login})
        if(!user) {
            return res.status(404).json({message: `User with login '${login}' not found`})
        }
        user.password = null
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//register
router.post("/auth/registration", async(req, res) => {
    try {
        const {name, login, password} = req.body
        const condidate = await User.findOne({login: login})
        if(condidate) {
            return res.status(400).json({message: "Login is already exists"})
        }
        if(!loginRegEx.test(login)) {
            return res.status(400).json({message: "Login must contain 4-16 characters (only latin letters and numbers)"})
        }
        if(!nameRegEx.test(name)) {
            return res.status(400).json({message: "Username must contain 2-16 characters"})
        }
        if(!passwordRegEx.test(password)) {
            return res.status(400).json({message: "Password must contain 8-25 characters (latin letters and numbers required)"})
        }

        const hashedPassword = bcrypt.hashSync(password, 5)
        const userRole = await Role.findOne({value: "USER"})
        const user = new User({
            name,
            login,
            password: hashedPassword,
            roles: [userRole.value]
        })
        await user.save()
        const accessToken = generateAccessToken(user.id, user.login, user.roles)
        const refreshToken = generateRefreshToken(user.id, user.login, user.roles)
        res.json({accessToken, refreshToken, expiresIn: 300})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

//login
router.post("/auth/login", async(req, res) => {
    try {
        const {login, password} = req.body
        const user = await User.findOne({login: login})
        if(!user) {
            return res.status(400).json({message: `User with login ${login} not found`})
        }
        const validPassword = bcrypt.compareSync(password, user.password)
        if(!validPassword) {
            return res.status(400).json({message: `Wrong password`})
        }
        const accessToken = generateAccessToken(user._id, user.login, user.roles)
        const refreshToken = generateRefreshToken(user.id, user.login, user.roles)
        res.json({accessToken, refreshToken, expiresIn: 300})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// GET ONE
router.get('/auth/me', verifyAccessToken, async(req, res) => {
    try {
        const user = await User.findOne({login: req.user.login})
        if(!user) {
            return res.status(401).json({message: "Authorization error"})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// update one
router.patch('/auth/me', verifyAccessToken, async(req, res) => {
    const {name, newPassword, oldPassword, avatar, cover, bio, login} = req.body
    let update = {}
    // console.log(req.body);
    const user = await User.findOne({login: req.user.login})

    if(login != null) {
        if(!loginRegEx.test(login)) {
            return res.status(400).json({message: "Login must contain 4-16 characters (only latin letters and numbers)"})
        }
        update.login = login
    }
    if(name != null) {
        if(!nameRegEx.test(name)) {
            return res.status(400).json({message: "Username must contain 2-16 characters"})
        }
        update.name = name
    }
    if(newPassword != null) {
        if(!bcrypt.compareSync(oldPassword, user.password)) {
            return res.status(400).json({message: "Wrong password"})
        }
        if(!passwordRegEx.test(newPassword)) {
            return res.status(400).json({message: "Password must contain 8-25 characters (latin letters and numbers required)"})
        }
        const hashedPassword = bcrypt.hashSync(newPassword, 5)
        update.password = hashedPassword
    }
    if(avatar != null) {
        const optimizedImage = await optimizeImage(avatar, 300, 300)
        if(!optimizedImage) return res.status(500).json({message: "Error while optimizing avatar image"})
        else update.avatar = optimizedImage
    }
    if(cover != null) {
        const optimizedImage = await optimizeImage(cover, 1920, 330)
        if(!optimizedImage) return res.status(500).json({message: "Error while optimizing cover image"})
        else update.cover = optimizedImage
    }
    if(bio != null) {
        if(bio.length > 500) {
            return res.status(400).json({message: "Bio must contain < 500 letters"})
        }
        update.bio = bio
    }

    try {
        const updatedUser = await User.findOneAndUpdate({login: req.user.login}, update, {new: true})
        if(login != null) {
            const refreshToken = generateRefreshToken(user._id, login, user.roles)
            const accessToken = generateAccessToken(user._id, login, user.roles)
            res.json({updatedUser, accessToken, refreshToken})
        } else {
            res.json(updatedUser)
        }
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})

// delete one
router.delete('/:id', getUser, async(req, res) => {
    try {
        await res.user.deleteOne()
        res.json({message: "Succesful deleted"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})
module.exports = router