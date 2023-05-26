/* eslint-disable prettier/prettier */
const multer = require("multer");
const path = require("path");
const catchAsync = require('../utils/catchAsync');
const AppError = require("./../utils/appError");

// const storage = multer.diskStorage({
//   destination: './../upload/images',
//   filename: (req, file, cb) => {
//       return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//   }
// })

// const upload = multer({
//   storage: storage,
//   limits: {
//       fileSize: 10
//   }
// })
exports.convertPdf = catchAsync(async (req, res) => {
  console.log(req.body);
  console.log("working");
  res.status(200).json({
    status: 'Convert PDF',
  });
});

