const fs = require("fs")
const env = require('dotenv')
env.config()
const Sequelize = require("sequelize")

var sequelize = new Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASS, {
  host: process.env.POSTGRES_HOST,
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
      ssl: { rejectUnauthorized: false }
  },
  query: { raw: true }
})

// testing our postgres connection 
// sequelize
//     .authenticate()
//     .then(function() {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(function(err) {
//         console.log('Unable to connect to the database:', err);
//     });

// album model
var Album = sequelize.define('Album', {
  albumID: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  title: Sequelize.STRING,
  artist: Sequelize.STRING,
  albumCover: Sequelize.STRING,
  year: Sequelize.INTEGER
})

// genre model
var Genre = sequelize.define('Genre', {
  genreID: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  genre: Sequelize.STRING,
})

Album.belongsTo(Genre, {foreignKey: 'genreID'})


let albums = []
let genres = []

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      console.log("DATABASE SYNC COMPLETE!")
      resolve()
    }).catch((err) => {
      console.log("DATABASE SYNC FAILED! Error: "+err)
      reject()
    })
  })
}

module.exports.getAlbums = () => {
  return new Promise((resolve, reject) => {
    Album.findAll().then((albumData) => {
      resolve(albumData)
    }).catch((err) => {
      console.log("CAN'T FIND ALBUMS! Error: "+err)
      reject()
    })
  })
}

module.exports.getAlbumById = (id) => {
  return new Promise((resolve, reject) => {
    Album.findAll({
      where: {
        albumID: id
      }
    }).then((album)=> {
      resolve(album)
    }).catch((err) => {
      console.log("CAN'T FIND ALBUM BY ID! Error: "+err)
      reject()
    })
  })
}

module.exports.getGenres = () => {
  return new Promise((resolve, reject) => {
    Genre.findAll().then((genreData)=> {
      resolve(genreData)
    }).catch((err) => {
      console.log("CAN'T FIND GENRES! Error: "+err)
      reject()
    })
  })
}

module.exports.addGenre = (genre) => {
  return new Promise((resolve, reject) => {
    Genre.create(genre).then(() => {
      console.log("GENRE CREATED!")
      resolve()
    }).catch((err) => {
      console.log("GENRE CREATION ERROR! Error: "+err)
    })
  })
}

module.exports.addAlbum = (album) => {
  return new Promise((resolve, reject) => {
    Album.create(album).then(() => {
      console.log("ALBUM CREATED!")
      resolve()
    }).catch((err) => {
      console.log("ALBUM CREATION ERROR! Error: "+err)
    })
  })
}

module.exports.getAlbumsByGenre = (genreID) => {
  return new Promise((resolve, reject) => {
    Album.findAll({
      where: {
        genreID: genreID
      }
    }).then((albums)=> {
      resolve(albums)
    }).catch((err) => {
      console.log("CAN'T FIND ALBUM BY GENRE! Error: "+err)
      reject()
    })
  })
}

module.exports.deleteAlbum = (albumID) => {
  return new Promise((resolve, reject) => {
    Album.destroy({
      where: {
        albumID: albumID
      }
    }).then(() => {
      console.log("ALBUM DELETED!")
      resolve()
    }).catch((err) => {
      console.log("ALBUM DELETION ERROR! Error: "+err)
    })
  })
}

module.exports.deleteGenre = (genreID) => {
  return new Promise((resolve, reject) => {
    Genre.destroy({
      where: {
        genreID: genreID
      }
    }).then(() => {
      console.log("GENRE DELETED!")
      resolve()
    }).catch((err) => {
      console.log("GENRE DELETION ERROR! Error: "+err)
    })
  })
}

