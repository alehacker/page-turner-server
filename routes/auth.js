var express = require("express");
var router = express.Router();

const User = require("../models/User.model");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const isAuthenticated = require('../middleware/isAuthenticated')


router.post("/signup", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out all fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(400).json({ message: "You've already registered" });
      } else {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(req.body.password, salt);

        const defaultImage = '../public/images/icons8-test-account-48.png';
        const profileImage = req.body.profile_image || defaultImage;

        User.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashedPass,
          profile_image: req.body.profile_image,
          bookCollection: [],
          bookClubs: []
        })
          .then((createdUser) => {
            const payload = { _id: createdUser._id, email: createdUser.email };

            const token = jwt.sign(payload, process.env.SECRET, {
              algorithm: "HS256",
              expiresIn: "24hr",
            });
            res.json({ token: token, id: createdUser._id });
          })
          .catch((err) => {
            res.status(400).json(err.message);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err.message);
    });
});

router.post("/login", (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "please fill out both fields" });
  }

  User.findOne({ email: req.body.email })
    .then((foundUser) => {
      if (!foundUser) {
        return res.status(401).json({ message: "Email or Password is incorrect!!!" });
      }

      const doesMatch = bcrypt.compareSync(
        req.body.password,
        foundUser.password
      );

      if (doesMatch) {
        const payload = { _id: foundUser._id,  email: foundUser.email };

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "24hr",
        });
        delete foundUser.password //Trying to not pass the pwd to the front end -- double check
        res.json({ token: token, foundUser, message: `Welcome ${foundUser.email}` });
      } else {
        return res.status(402).json({ message: "Email or Password is incorrect" });
      }
    })
    .catch((err) => {
      res.json(err.message);
    });
});

router.get("/verify", isAuthenticated, (req, res) => {
  return res.status(200).json(req.user);
});


module.exports = router;