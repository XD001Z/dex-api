const router = require('express').Router();
const fileUploader = require("../config/cloudinary.config");
const Anime = require('../models/Anime.model');

router.post("/", fileUploader.single("image"), (req, res, next) => {
    if (!req.file) {
        // next(new Error("No File Uploaded!"));
        return res.status(400).json({ message: "NO File Brev" });
    }
    else {
        Anime.create({
            dexNum: 100,
            name: "InuYasha",
            alt: "Inuyasha",
            img: req.file.path
        })
        .then((createdUser) => {
            res.status(200).json(createdUser);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        })
    }
});

module.exports = router;