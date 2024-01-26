require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on("error", (error) => console.error(error))
db.once('open', () => console.log('Connected to DB'))

app.use(express.json({limit: "10mb"}))

const usersRouter = require(`./routes/users`)
const animeListRouter = require(`./routes/animeList`)
app.use('/users', usersRouter, animeListRouter)
// app.use('/users/:id', animeListRouter)

app.listen(PORT, () => console.log("STARTED on port " + PORT))
