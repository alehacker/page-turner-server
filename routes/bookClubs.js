var express = require('express');
var router = express.Router();

const BookClub = require('../models/BookClub.model')
const Book = require('../models/Book.model')
const User = require('../models/User.model')
const isOwner = require('../middleware/isOwner');
const isAuthenticated = require('../middleware/isAuthenticated');

const fileUploader = require('../config/cloudinary.config');

/* Listing all the Book Clubs available */
router.get('/', (req, res, next) => {
   BookClub.find()
     .populate('creator')
     .populate('currentBook')
     .populate('bookCollection')
     .populate('members')
     .sort({createdAt: -1})
     .then((foundBookClubs) => {
         res.json(foundBookClubs)
     })
     .catch((err) => {
         console.log(err)
     })
});

/**** Book Club Details Route ******/
router.get('bookclub-details', fileUploader.single('clubImg'), (req, res, next) =>{
   BookClub.findById(req.params._id)
   .populate('creator')
   .populate('currentBook')
   .populate('bookCollection')
   .populate('members')
   .then((foundBookClub) =>{
         res.json(foundBookClub)
   //    let urlArray = foundBookClub.clubImg.split('.')
   //    let extension = urlArray[urlArray.length-1]
   //    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
   //       res.json(foundBookClub)
   //   } else {
   //       res.json(foundBookClub)
   //   }
   })
   .catch((err) => {
      console.log(err)
   })

})

/* Create a Book Club */
router.post('/create-bookclub/:userId', (req, res, next) => {

   const defaultImage = '/images/robert-anasch-McX3XuJRsUM-unsplash.jpg';
   const clubImg = req.body.clubImg|| defaultImage;

   let newBookClub = {
      name: req.body.name,
      description: req.body.description,
      clubImg: clubImg,  //<--- use cloudinary for this.
      meetingLink: req.body.meetingLink,
      schedule: req.body.schedule,
      creator:  [req.body.userId],
      currentBook:  [],
      bookCollection:  [],
      members:  [req.params.userId] //<---- since the creator is the first member
   }

   BookClub.create(newBookClub)
   .then((createdBookClub) => {
       User.findByIdAndUpdate(
           {
               _id: req.params.userId
           }, 
           {
           $push: {bookClubs: createdBookClub._id}
           },
           {new: true})
       return createdBookClub
   })
   .then((createdBookClub) => {
      res.json(createdBookClub)
  })
   // .then((createdBookClub) => {
   //      return createdBookClub.populate('bookCollection')  // <=== Should this be populated, since the book collection is non existent
   //     })
   // .then((populated) => {
   //     return populated.populate('members') // Doble check all this populate actions since, the book club is just created.
   // })
   // .then((populatedBookClub) => {
   //     res.json(populatedBookClub)
   // })
   .catch((err) => {
       console.log(err)
   })
   
})

/* Editing a  Book Club  */
router.post('/edit-bookclub/:bookclubId/:userId', isOwner, (req, res, next) => {

      const clubImg = req.body.clubImg ? req.body.clubImg : '/images/robert-anasch-McX3XuJRsUM-unsplash.jpg';
      
      //I could do this for default values of the bookcollection and the current book
      // const currentBook = req.body.currentBook || '';
      // const bookCollection = req.body.bookCollection || [];
      
      let update = {
         name: req.body.name,
         description: req.body.description,
         clubImg: clubImg,
         meetingLink: req.body.meetingLink,
         schedule: req.body.schedule
      };
      if (req.body.currentBook) {
         update.currentBook = req.body.currentBook;
      }

      if (req.body.bookCollection) {
         update.bookCollection = req.body.bookCollection;
      }

      BookClub.findByIdAndUpdate(req.params.bookclubId,
         update,
         { new: true }
      )
         .then((updatedBookClub) => {
            res.json(updatedBookClub);
         })
         .catch((err) => {
            console.log(err);
         });
      
    res.send('POST request received')
})
/**** Delete Book Club Route *******/
router.get('/delete-bookclub/:bookclubId/:userId', isOwner, (req, res, next) => {
   User.findById(req.params.userId)
       .then((foundUser) => {
           if (foundUser.bookClubs.includes(req.params.bookclubId)) {
               BookClub.findByIdAndDelete(req.params.bookclubId)
                   .then((deletedBookClub) => {
                       res.json(deletedBookClub)
                   })
                   .catch((err) => {
                       console.log(err)
                   })
           } else {
               res.json({message: "You can't delete this post"})
           }
       })
       .catch((err) => {
           console.log(err)
       })
})

//I'm not sure where to add this route, books or bookclubs
//maybe bookclubs
router.post('/add-book/:bookclubId/:userId', isOwner, (req, res, next) => {
   const { bookId } = req.body;
   const { bookclubId } = req.params
   
   BookClub.findByIdAndUpdate(
      bookclubId,
      { $addToSet: { bookCollection: bookId } }, 
      { new: true }
   )
   .populate('bookCollection')
   .then((updatedBookClub) => {
         res.json(updatedBookClub);
   })
   .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Error adding book to book club' });
   });
})



module.exports = router;