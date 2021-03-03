require("dotenv/config")

const express = require("express");
const pool = require("./db");
const path = require("path");
const app = express();
const cors = require("cors");
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require('multer-s3')
const PORT = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//routes

//fileupload
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_BUCKET_NAME,
      metadata: function (req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
        cb(null, Date.now().toString())
      }
    })
  })


app.post('/upload', upload.single('pdf'), function(req, res, next) {
    res.send(req.file)
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, () => {
    console.log(`server at port ${PORT}`);
});

// app.get("*", (req,res) => {
//   res.sendFile(path.join(__dirname, "./client/public/index.html"));
// });