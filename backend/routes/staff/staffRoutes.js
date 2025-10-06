
const express = require('express')
const fileController = require('../../Controller/file/fileController')
const upload = require('../../multer/multer')
const router = express.Router()



router.post('/upload', upload.single('stafffile'), fileController.uploadFile);
router.delete('/deletefile/:id', fileController.deleteFile)