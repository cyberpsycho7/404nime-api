const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const bcrypt = require('bcryptjs')
const passwordRegEx = /^([A-Za-z0-9])([^\s]){7,16}$/
const loginRegEx = /^[A-Za-z0-9]{4,16}$/
const nameRegEx = /^.{2,16}$/
const bioRegEx = /^.{0,500}$/
const jwt = require('jsonwebtoken')
const verifyAccessToken = require("../middleware/verifyAccessToken")
const generateAccessToken = require("../helpers/generateAccessToken")
const generateRefreshToken = require("../helpers/generateRefreshToken")

// const generateAccessToken = (id, login, roles) => {
//     const payload = {
//         id,
//         login,
//         roles
//     }
//     console.log(process.env.JWT_ACCESS_SECRET);
//     return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: "5m"})
// }
// const generateRefreshToken = (id, login, roles) => {
//     const payload = {
//         id,
//         login,
//         roles
//     }

//     console.log(process.env.JWT_REFRESH_SECRET);
//     return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: "30d"})
// }

// const verifyAccessToken = (req, res, next) => {
//     if(req.method === "OPTIONS") {
//         next()
//     }
//     try {
//         const token = req.headers.authorization.split(' ')[1]
//         if(!token) {
//             return res.status(403).json({message: "JWT required"})
//         }
//         const decodedData = jwt.verify(token, process.env.JWT_SECRET)
//         req.user = decodedData
//         next()
//     } catch (error) {
//         return res.status(403).json({message: error.message})
//     }
// }

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

// const isUserExists = async(req, res, next) => {
//     let userName;
//     let userMail;
//     try {
//         userName = await User.find({name: req.body.name})
//         userMail = await User.find({mail: req.body.mail})
//         if(userName.length && userMail.length) {
//             return res.status(400).json({message: "Name and Mail are already exists"})
//         } else if(userName.length) {
//             return res.status(400).json({message: "Name is already exists"})
//         } else if(userMail.length) {
//             return res.status(400).json({message: "Mail is already exists"})
//         }
//     } catch (error) {
//         return res.status(500).json({message: error.message})
//     }

//     next()
// }

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

// router.post("/role", async(req, res) => {
//     try {
//         const def = new Role()
//         const def2 = new Role({value: "ADMIN"})
//         await def.save()
//         await def2.save()
//     } catch {
//         console.log("Error");
//     }
// })

// create one
// router.post('/', isUserExists, async(req, res) => {

//     const user = new User({
//         name: req.body.name,
//         mail: req.body.mail,
//         avatar: req.body.avatar
//     })

//     try {
//         const newUser = await user.save()
//         res.status(201).json(newUser)
//     } catch (err) {
//         res.status(400).json({message: err.message})
//     }
// })

// update one
router.patch('/auth/me', verifyAccessToken, async(req, res) => {
    const {name, newPassword, oldPassword, avatar, cover, bio, login} = req.body
    let update = {}
    console.log(req.body);
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
        update.avatar = avatar
    }
    if(cover != null) {
        update.cover = cover
    }
    if(bio != null) {
        if(bio.length > 500) {
            return res.status(400).json({message: "Bio must contain < 500 letters"})
        }
        update.bio = bio
    }

    try {
        await User.findOneAndUpdate({login: req.user.login}, update, {new: true})
        const refreshToken = generateRefreshToken(user._id, login, user.roles)
        const accessToken = generateAccessToken(user._id, login, user.roles)
        res.json({accessToken, refreshToken})
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