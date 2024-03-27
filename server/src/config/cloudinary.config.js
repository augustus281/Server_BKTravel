'use strict'

const multer = require("multer")
const cloudinary = require("cloudinary").v2
const fs = require("fs")
const { CloudinaryStorage } = require('multer-storage-cloudinary')

if (!fs.existsSync("./images")) {
    fs.mkdirSync("./images")
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

// Multer setup
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./images")
    },
    filename: function(req, file, callback) {
        callback(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

module.exports = upload