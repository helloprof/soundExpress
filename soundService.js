
const fs = require("fs")


let albums = []

module.exports.readMyFile = (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.log("there's been an error!! ERROR: "+ err)                
                reject(err)
            } else {
                // console.log(data)
                albums = JSON.parse(data)
                resolve(albums)
            }
        })
    } )
}


