const express = require(`express`)
const router = express.Router()
const image = require('../models/imageModel')

router.post('/images', async(req, res) => {
    console.log(req.body);
})
