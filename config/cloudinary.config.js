const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
 
const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    // allowed_formats: ['jpg', 'png', 'pdf', 'docx','doc'],
    folder: 'movie-project',
     // The name of the folder in cloudinary
    // filename_override: 'original-filename',
    // unique_filename: false,
    // use_filename: true,
    resource_type: 'auto',
    // overwrite: true
    // => this is in case you want to upload other type of files, not just images
  }
});

//The following lines of code takes a word document and turns it into a pdf
// cloudinary.uploader.upload("path/to/word/document.docx", {
//     resource_type: "raw",
//     format: "pdf"
//   }, function(result) {
//     console.log(result);
//   });
  

 
//                     storage: storage
module.exports = multer({ storage });