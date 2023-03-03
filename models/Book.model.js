const { Schema, model } = require("mongoose");

const bookSchema = new Schema(
  {
   title: String,
   author: String,
   pages: String,
   bookImg: String,
   description: String,
   publishedDate: String,
   bookId: String,
   readBy: [{type: Schema.Types.ObjectId, ref: "BookClub"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const Book = model("Book", bookSchema);

module.exports = Book;