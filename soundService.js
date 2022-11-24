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

// song model 
var Song = sequelize.define('Song', {
  songID: {
    type: Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  }, 
  title: Sequelize.STRING, 
  songFile: Sequelize.STRING
})

Song.belongsTo(Album, {foreignKey: 'albumID'})
Album.belongsTo(Genre, {foreignKey: 'genreID'})


let albums = []
let genres = []

module.exports.initialize = () => {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(() => {
      console.log("POSTGRES DB SYNC COMPLETE!")
      resolve()
    }).catch((err) => {
      console.log("POSTGRES DB SYNC FAILED! Error: "+err)
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
      reject()
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
      reject()
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
      reject()
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
      reject()
    })
  })
}

module.exports.getSongs = (albumID) => {
  return new Promise((resolve, reject) => {
    Song.findAll({
      where: {
        albumID: albumID
      }
    }).then((songs)=> {
      resolve(songs)
    }).catch((err) => {
      console.log("CAN'T FIND SONGS BY THIS ALBUM ID! Error: "+err)
      reject()
    })
  })
}

module.exports.addSong = (song) => {
  return new Promise((resolve, reject) => {
    Song.create(song).then(() => {
      console.log("SONG CREATED!")
      resolve()
    }).catch((err) => {
      console.log("SONG CREATION ERROR! Error: "+err)
      reject()
    })
  })
}

module.exports.deleteSong = (songID) => {
  return new Promise((resolve, reject) => {
    Song.destroy({
      where: {
        songID: songID
      }
    }).then(() => {
      console.log("SONG DELETED!")
      resolve()
    }).catch((err) => {
      console.log("SONG DELETION ERROR! Error: "+err)
      reject()
    })
  })
}
