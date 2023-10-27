const router = require('express').Router();
const User = require('../models/User.model');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/login', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Provide email and password" });
    }

    User.findOne({email})
    .populate("registered")
    .then((foundUser) => {
        if (!foundUser) {
            return res.status(401).json({ message: "User not found" });
        }
        if (!(bcryptjs.compareSync(password, foundUser.password))) {
            return res.status(401).json({ message: "Unable to authenticate user" });
        }
        const { _id, registered } = foundUser;
        registered.sort((a, b) => a.dexNum - b.dexNum);
        const payload = { _id };
        const authToken = jwt.sign(payload, process.env.SECRET, {expiresIn: "1d"});
        res.status(200).json({ _id, registered, authToken });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    })

});

router.post('/signup', (req, res, next) => {
    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email || !password) {
        return res.status(400).json({ message: "Provide email and password" });
    }
    if (!(emailRegex.test(email))) {
        return res.status(400).json({ message: "Provide valid email address" });
    }

    User.findOne({email})
    .then((foundUser) => {
        if (foundUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = bcryptjs.genSaltSync();
        const hash = bcryptjs.hashSync(password, salt);

        User.create({email, password: hash})
        .then((createdUser) => {
            const { _id, registered } = createdUser;
            const payload = { _id };
            const authToken = jwt.sign(payload, process.env.SECRET, { expiresIn: "1d" });
            res.status(200).json({ _id, registered, authToken });
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    });
});

module.exports = router;