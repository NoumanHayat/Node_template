const express = require('express');
const multer = require('multer');
const globalController = require('../controllers/globalController');

const router = express.Router();
const upload = multer({ dest: '/' });
router.all('/convertPdf', globalController.convertPdf);
module.exports = router;
