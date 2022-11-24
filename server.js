const express = require("express")
const app = express()
const path = require("path")

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const env = require('dotenv')
env.config()

const soundService = require("./soundService")
const userService = require("./userService")

const exphbs = require('express-handlebars')
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

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
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname,"/views/about.html"))
  res.redirect("/albums")
})

app.get("/albums", (req, res) => {
  if (req.query.genre) {
    soundService.getAlbumsByGenre(req.query.genre).then((genreAlbums) => {
      res.render('albums', {
        data: genreAlbums,
        layout: 'main'
      })
    }).catch((err) => res.json({message: err})) 
  } else {
  soundService.getAlbums().then((albums) => {
    res.render('albums', {
      data: albums,
      layout: 'main'
    })
  }).catch((err) => res.json({message: err}))
  }
})


app.get("/albums/new", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/albumForm.html"))
  soundService.getGenres().then((genres) => {
    res.render('albumForm', {
      data: genres,
      layout: 'main'
    })
  })
})

app.post("/albums/new", upload.single("albumCover"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(imageUrl) {
    req.body.albumCover = imageUrl;
    soundService.addAlbum(req.body).then(() => {
      res.redirect("/albums")
    })
  }

})

app.get("/albums/:id", (req, res) => {
  soundService.getAlbumById(req.params.id).then((album) => {
    // var array = []
    // array.push(album)
    res.render('albums', {
      data: album,
      layout: 'main'
    })
  }).catch((err) => {
    res.json({message: err})
  })
})

app.get("/genres", (req, res) => {
  soundService.getGenres().then((genres) => {
    res.render('genres', {
      data: genres,
      layout: 'main'
    })
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

app.get("/genres/new", (req, res) => {
  soundService.getGenres().then((genres) => {
    res.render('genreForm', {
      data: genres,
      layout: 'main'
    })
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

app.get("/genres/delete/:id", (req, res) => {
  soundService.deleteGenre(req.params.id).then(() => {
    res.redirect("/genres")
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

app.get("/albums/delete/:id", (req, res) => {
  soundService.deleteAlbum(req.params.id).then(() => {
    res.redirect("/albums")
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

// app.use(express.urlencoded({ extended: true }))

app.post("/genres/new", (req, res) => {
  console.log(req.body)
  soundService.addGenre(req.body).then(() => {
    res.redirect("/genres")
  })
})

app.get("/songs/new", (req, res) => {
  // res.sendFile(path.join(__dirname, "/views/albumForm.html"))
  soundService.getAlbums().then((albums) => {
    res.render('songForm', {
      data: albums,
      layout: 'main'
    })
  })
})

app.post("/songs/new", upload.single("songFile"), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {resource_type: "video",
          use_filename: true
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result);
      return result;
    }

    upload(req).then((uploaded) => {
      processPost(uploaded.url);
    });
  } else {
    processPost("");
  }

  function processPost(songFileURL) {
    req.body.songFile = songFileURL;
    const currentAlbumID = req.body.albumID
    soundService.addSong(req.body).then(() => {
      res.redirect(`/songs/${currentAlbumID}`)
    })
  }

})

app.get("/songs/:albumID", (req, res) => {
  soundService.getSongs(req.params.albumID).then((songs) => {
    res.render('songs', {
      data: songs,
      layout: 'main'
    })
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

app.get("/songs/delete/:songID", (req, res) => {
  soundService.deleteSong(req.params.songID).then(() => {
    res.redirect("/albums")
  }).catch((err) => {
    console.log(err)
    res.json({message: err})
  })
})

app.get("/register", (req, res) => {
  res.render('registerForm', {
    layout: 'main'
  })
})

app.post("/register", (req, res) => {
  console.log(req.body)
  userService.registerUser(req.body).then((data) => {
    console.log(data)
    res.render('registerForm', {
      successMessage: "User Created Successfully!"
    })
  }).catch((err) => {
    console.log(err)
    res.render('registerForm', {
      errorMessage: "User Creation Error: "+err
    })
  })
})

app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

soundService.initialize()
.then(userService.initialize)
.then(() => {
  app.listen(HTTP_PORT, onHttpStart)
}).catch((err) => {
  console.log(err)
})