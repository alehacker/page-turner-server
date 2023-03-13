var express = require('express');
var router = express.Router();

const User = require("../models/User.model")

// GET Profile
router.get('/profile/:userId', (req, res, next)  => {
   User.findById(req.params.userId)
    .populate('bookCollection')
    .populate('bookClubs')
    .then((foundUser) => {
       res.json(foundUser)
    })
    .catch((err) =>{
       console.log(err)
    })
 });

 router.post('/profile-edit/:userId', (req, res, next)  => {
   User.findByIdAndUpdate(req.params.userId, 
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // profile_image: req.body.profile_image,
      // bookCollection: [],
      // bookClubs: []
    },
    {new: true}
   )
   .populate('bookCollection')
   .populate('bookClubs')
   .then((updatedUser) =>{
    res.json(updatedUser)
   })
   .catch((err) =>{
    console.log(err)
   })
 });



module.exports = router;
