/* eslint-disable node/no-deprecated-api */
/* eslint-disable no-undef */
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const globalRoutes = require('./routes/globalRoutes');

// const doc = new PDFDocument();
const app = express();
app.use(express.urlencoded({ extended: true }));

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     return cb(null, '/uploads');
//   },
//   filename: function(req, file, cb) {
//     return cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });
// const Storage = multer.diskStorage({
//   destination: function(req, file, callback) {
//     callback(null, 'images');
//   },
//   filename: function(req, file, callback) {
//     callback(null, file.orignalname);
//   }
// });
const upload = multer({'/'});
// app.post('/upload', (req, res) => {
//   console.log(req.file);
//   upload(req, res, err => {
//     if (err) {
//       console.log(err);
//       return res.send('somthing went wrong');
//     }
//     return res.send('file uploaded successfully');
//   });
// });
// const upload = multer({ dest: '/', limits: { fieldSize: 1000000000 } });
app.post('/profile', upload.single('image'), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  let doc = new PDFDocument();
  doc.pipe(fs.createWriteStream('outputss.pdf'));
  doc.image(req.file.path, {
    fit: [500, 400],
    align: 'center',
    valign: 'center'
  });
  doc.addPage().image(req.file.path, {
    fit: [500, 400],
    align: 'center',
    valign: 'center'
  });
  doc.addPage().image(req.file.path, {
    fit: [500, 400],
    align: 'center',
    valign: 'center'
  });
  doc.end();
  console.log('okkk');
  res.send(req.file);
  // console.log(req.file);
  // const filePath = './outputss.pdf'; // or any file format

  // // Check if file specified by the filePath exists
  // fs.exists(filePath, function(exists) {
    if (exists) {
      // Content-type is very interesting part that guarantee that
      // Web browser will handle response in an appropriate manner.
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=llk.pdf`
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('ERROR File does not exist');
  });
  // res.send('ok');
});
app.all('/check', function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  // console.log(req.file);
  const filePath = './outputss.pdf'; // or any file format

  // Check if file specified by the filePath exists
  fs.exists(filePath, function(exists) {
    if (exists) {
      // Content-type is very interesting part that guarantee that
      // Web browser will handle response in an appropriate manner.
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=llk.pdf`
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('ERROR File does not exist');
  });
  // res.send('ok');
});
app.use(cors());
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.post('/profile', upload.single('avatar'), function(req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
});
// Limit requests from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);
// create application/json parser
const jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false });
// Body parser, reading data from body into req.body
// app.use(express.json({ limit: '10kb' }));
app.use(jsonParser);

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());
app.use(upload.array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});
// 3) ROUTES
app.use('/', upload.single('image'), (req, res) => {
  console.log(req.body);
  console.log('working');
  res.status(200).json({
    status: 'Convert PDF'
  });
});
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
