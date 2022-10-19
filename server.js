const express = require("express")
const app = express()
const path = require("path")

const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

const env = require('dotenv')
env.config()

const soundService = require("./soundService")

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
    var array = []
    array.push(album)
    res.render('albums', {
      data: array,
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

app.use((req, res) => {
  res.status(404).send("Page Not Found");
})

soundService.initialize().then(() => {
  app.listen(HTTP_PORT, onHttpStart)
}).catch((err) => {
  console.log(err)
})