

const readFile = require("./readFile")


readFile.readMyFile("./data/albums.json").then((albums) => {
    console.log(albums)
}).catch((err) => {
    console.log("ERROR: "+ err)
})