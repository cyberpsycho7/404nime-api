const jwt = require('jsonwebtoken')
const express = require("express")

const verifyAccessToken = (req, res, next) => {
    if(req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            return res.status(401).json({message: "JWT Required"})
        }
        const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
        req.user = decodedData
        next()
    } catch (error) {
        return res.status(401).json({message: error.message})
    }
}

module.exports = verifyAccessToken