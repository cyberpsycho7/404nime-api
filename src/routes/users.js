const express = require(`express`)
const router = express.Router()
const User = require('../models/userModel')
const Role = require('../models/roleModel')
const bcrypt = require('bcryptjs')
const passwordRegEx = /^([\W\w])([^\s]){7,16}$/
const loginRegEx = /^[A-Za-z0-9]{4,16}$/
const jwt = require('jsonwebtoken')

const genereteAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    console.log(process.env.JWT_SECRET);
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "24h"})
}

const verifyAccessToken = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(403).json({message: "JWT required"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedData
        next()
    } catch (error) {
        return res.status(403).json({message: error.message})
    }
}

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

const isUserExists = async(req, res, next) => {
    let userName;
    let userMail;
    try {
        userName = await User.find({name: req.body.name})
        userMail = await User.find({mail: req.body.mail})
        if(userName.length && userMail.length) {
            return res.status(400).json({message: "Name and Mail are already exists"})
        } else if(userName.length) {
            return res.status(400).json({message: "Name is already exists"})
        } else if(userMail.length) {
            return res.status(400).json({message: "Mail is already exists"})
        }
    } catch (error) {
        return res.status(500).json({message: error.message})
    }

    next()
}

// GET all
router.get('/', verifyAccessToken, async(req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//register
router.post("/registration", async(req, res) => {
    try {
        const {name, login, password} = req.body
        const condidate = await User.findOne({login: login})
        if(condidate) {
            return res.status(400).json({message: "Login is already exists"})
        }
        if(!loginRegEx.test(login)) {
            return res.status(400).json({message: "Login must contain 4-16 characters (only letters and numbers)"})
        }
        console.log(password);
        if(!passwordRegEx.test(password)) {
            return res.status(400).json({message: "Password must contain 8-25 characters (letters and numbers required)"})
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
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post("/login", async(req, res) => {
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
        const token = genereteAccessToken(user._id, user.roles)
        res.json({token})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post("/:id/")

// GET ONE
router.get('/:id', getUser, async(req, res) => {
    res.send(res.user)
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
router.post('/', isUserExists, async(req, res) => {

    const user = new User({
        name: req.body.name,
        mail: req.body.mail,
        avatar: req.body.avatar
    })

    try {
        const newUser = await user.save()
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

// update one
router.patch('/:id', getUser, isUserExists, async(req, res) => {
    if(req.body.name != null) {
        res.user.name = req.body.name
    }
    if(req.body.mail != null) {
        res.user.mail = req.body.mail
    }

    try {
        const updatedUser = await res.user.save()
        res.json(updatedUser)
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