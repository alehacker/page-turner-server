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

   Book.findOne({_id: bookId})
   .then((foundBook) =>{
      if (foundBook){
         console.log ('Here is the book from MongoDB --->', foundBook)
         foundBook.readBy.push(req.user._id)
         console.log ('Here is the new array of readers --->', foundBook.readBy)
         foundBook.save()
         .then(() => {
            return User.findByIdAndUpdate(req.user._id, 
               {$addToSet: {bookCollection: foundBook._id }},
               {new: true}
            ) 
            .populate('bookCollection')
            .populate('bookClubs')
            .exec()
         })
         .then((updatedUser) => {
            res.json(updatedUser)
         })
         .catch((err) => {
            console.log(err)
            res.status(500).send('Internal Server Error')
         })
      } else {

         let newBook = {
            title: req.body.volumeInfo.title,
            author: req.body.volumeInfo.authors.join(', '), //don't forget authors is an array of author names
            pages: req.body.volumeInfo.pageCount,
            bookImg: req.body.volumeInfo.imageLinks.thumbnail ,
            description: req.body.volumeInfo.description,
            publishedDate: req.body.volumeInfo.publishedDate,
            bookId: bookId,
            readBy: [req.user._id]
         }

         console.log(newBook)

         Book.create(newBook)
          .then((createdBook) =>{
             if (createdBook){
                User.findByIdAndUpdate(req.user._id, 
                   {$addToSet: {bookCollection: createdBook._id }},
                   {new: true}
                ) 
                .populate('bookCollection')
                .populate('bookClubs')
                .exec()
                .then((updatedUser) => {
                   res.json(updatedUser)
                })
                .catch((err) => {
                   console.log(err)
                   res.status(500).send('Internal Server Error')
                })
             }
          })
          .catch((err) => {
             console.log(err)
             res.status(500).send('Internal Server Error')
          })
      }
   })
})

router.get('/book-details/:bookId',  (req, res, next) =>{
   Book.findById(req.params.bookclubId)
   .populate('readBy')
   .then((foundBook) =>{
         res.json(foundBook)
   })
   .catch((err) => {
      console.log(err)
   })

})



module.exports = router;
