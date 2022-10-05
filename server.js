const express = require("express")
const app = express()
const path = require("path")

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const env = require('dotenv')
env.config()

const soundService = require("./soundService")

const HTTP_PORT = process.env.PORT || 8080

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true
})

const upload = multer() // no { storage: storage } 

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT + " 🚀🚀🚀")
}

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname,"/views/about.html"))
})

app.get("/albums", (req, res) => {
  soundService.getAlbums().then((albums) => {
    res.json(albums)
  }).catch((err) => {
    console.log(err)
    res.send("there's been an error!")
  })
})

app.get("/albums/:id", (req, res) => {
  soundService.getAlbumById(req.params.id).then((album) => {
    res.json(album)
  }).catch((err) => {
    res.send(err)
  })
})

app.get("/genres", (req, res) => {
  soundService.getGenres().then((genres) => {
    res.json(genres)
  }).catch((err) => {
    console.log(err)
    res.send("there's been an error!")
  })
})

app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

soundService.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart)
}).catch((err) => {
  console.log(err)
})