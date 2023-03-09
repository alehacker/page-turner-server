const jwt = require("jsonwebtoken");
const BookClub = require('../models/BookClub.model');

const isOwner = (req, res, next) => {
   console.log("isOwner headers", req.headers)
   console.log("isOwner params", req.params)
  BookClub.findById(req.params.bookclubId)
  .then((bookClub) =>{
      console.log("Book club", bookClub)
      if (!bookClub) {
         return res.status(404).json({ message: "Book club not found" });
      }
      if (req.user._id !== bookClub.creator.toString()) {
         console.log("user", req.user)
         console.log("creator", bookClub.creator.toString(), bookClub.creator.toHexString())
         return res.status(401).json({ message: "Unauthorized" });
      } 
      if (req.user._id === bookClub.creator.toString()) {
         console.log("user", req.user)
         console.log("creator", bookClub.creator.toString(), bookClub.creator.toHexString())
         next()
      } 
   })
   .catch((err) =>{
      console.log('ERROR on isOwner', err)
   })
};

module.exports = isOwner;






// const token = req.headers.authorization?.split(" ")[1];

//   if (!token || token === "null") {
//     return res.status(400).json({ message: "Token not found" });
//   }

//   try {
//     const tokenInfo = jwt.verify(token, process.env.SECRET);
//     req.user = tokenInfo;

//     const bookClubId = req.params.bookclubId;
//     BookClub.findById(bookClubId)
//       .then((bookClub) => {
//         if (!bookClub) {
//           return res.status(404).json({ message: "Book club not found" });
//         }

//         if (req.user.userId !== bookClub.creator.toString()) {
//           return res.status(401).json({ message: "Unauthorized" });
//         }

        
//         return next(); 
//       }).catch(next);
//   } catch (error) {
//     console.log(error.message, "Error.message");
//     return res.status(401).json(error);
//   }
