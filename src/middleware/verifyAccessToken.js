const jwt = require('jsonwebtoken')
const express = require("express")

const verifyAccessToken = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(403).json({message: "Unauthorized"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedData
        next()
    } catch (error) {
        return res.status(403).json({message: error.message})
    }
}

module.exports = verifyAccessToken