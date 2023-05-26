/* eslint-disable no-console */
/* eslint-disable node/no-deprecated-api */
/* eslint-disable no-undef */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// const doc = new PDFDocument();
const app = express();

const Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'image');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
const upload = multer({
  dest: './Node js/upload',
  limits: { fieldSize: 1000000000 }
}).array('image', 3);
// const upload = multer({'dest '}).array('image', 3);
app.post('/upload', (req, res) => {
  upload(req, res, err => {
    if (err) {
      console.log(err);
      return res.send('somthing went wrong');
    }
    try {
      const doc = new PDFDocument();
      console.log(req.body.title);
      doc.pipe(fs.createWriteStream(`${req.body.title}.pdf`));
      console.log(req.files[0]);

      req.files.forEach((file, index) => {
        console.log('-----------');
        if (index === 0) {
          doc.image(file.path, {
            fit: [500, 400],
            align: 'center',
            valign: 'center'
          });
        } else {
          doc.addPage().image(file.path, {
            fit: [500, 400],
            align: 'center',
            valign: 'center'
          });
        }
        console.log(index);
        fs.unlinkSync(file.path);
      });

      doc.end();
      // doc.end();
    } catch (e) {
      console.error(e);
    }
    // return res.send(doc);
    try {
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=llk.pdf`
      });
      fs.createReadStream(`${req.body.title}.pdf`).pipe(res);
      // res.writeHead(400, { 'Content-Type': 'text/plain' });
      // res.end('ERROR File does not exist');
    } catch (e) {
      res.send(400, 'Something went wrong');
      console.log(e);
    }
  });
});

module.exports = app;
