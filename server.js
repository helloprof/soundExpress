const express = require("express")
const app = express()
const path = require("path")

const soundService = require("./soundService")

const HTTP_PORT = 8080

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
  app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
  console.log(err)
})