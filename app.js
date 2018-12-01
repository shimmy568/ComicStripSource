const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }).single('photo');

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
  next();
});

app.post('/upload', upload, (req, res) => {
  if (!req.file) {
    throw new Error('no file');
  } else {
    const buffer = new Buffer(req.file.path);
    recognize(buffer, (err, text) => {
      if (err) {
        throw err;
      }
      else {

        const fileContent = text.replace(/\n|\r/g, '');
        //  TODO SAVE FINAL TEXT IN DATABASE
        const { fileExt, fileName } = req.query;
        client.query(`INSERT INTO file_table(file_ext, file_content, file_name) VALUES ('${fileExt}', '${fileContent}', '${fileName}');`, (err, response) => {
          //  console.log(err, res)
          res.send(response);
          //  client.end()
        });

      }
    });
  }
});

module.exports = app;