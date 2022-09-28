
const fs = require("fs")


let albums = []
let genres = []

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/albums.json', 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        console.log(data)
        albums = JSON.parse(data)
        fs.readFile('./data/genres.json', 'utf8', (err, data) => {
          if (err) {
            reject(err)
          } else {
            console.log(data)
            genres = JSON.parse(data)
            resolve("Success!")
          }
        })
      }
    })
  })
}

module.exports.getAlbums = () => {
  return new Promise((resolve, reject) => {
    if(albums.length > 0) {
      resolve(albums)
    } else {
      reject("no albums")
    }
  })
}

module.exports.getGenres = () => {
  return new Promise((resolve, reject) => {
    if(genres.length > 0) {
      resolve(genres)
    } else {
      reject("no albums")
    }
  })
}


