var express = require('express');
var router = express.Router();

const Book = require('../models/Book.model')
const User = require('../models/User.model')
const BookClub = require('../models/BookClub.model');
const isAuthenticated = require('../middleware/isAuthenticated');

/* GET Add Book */
router.post('/add-book/:bookId', isAuthenticated, (req, res, next) => {

   console.log(req.user)
   const {bookId} = req.params

   let newBook = {
      title: req.body.volumeInfo.title,
      author: req.body.volumeInfo.authors, //don't forget authors is an array of author names
      pages: req.body.volumeInfo.pageCount,
      bookImg: req.body.volumeInfo.imageLinks ,
      description: req.body.volumeInfo.description,
      publishedDate: req.body.volumeInfo.publishedDate,
      bookId: bookId,
      readBy: []
   }

   console.log(newBook)

  Book.create(newBook)
   .then((createdBook) =>{
      if (createdBook){
         User.findByIdAndUpdate(req.user._id, 
            {$addToSet: {bookCollection: createdBook._id }},
            {new: true}
         ) 
         .then((updatedUser) => {
            return updatedUser.populate('bookCollection')
         })
        .then((populated) => {
            return populated.populate('bookClubs')
         })
         .then((second) => {
            res.json(second)
        })
        .catch((err) => {
         console.log(err)
        })
      }
   })

   //need to add book to a bookclub
})



module.exports = router;

