require('dotenv').config()

const serverless = require("serverless-http")
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

app.use(express.json({limit: "10mb"}))

const usersRouter = require(`./routes/users`)
const animeListRouter = require(`./routes/animeList`)
app.use('/.netlify/functions/api', usersRouter, animeListRouter)
// app.use('/users/:id', animeListRouter)

app.listen(3000, () => console.log("STARTED"))
module.exports.handler = serverless(app)