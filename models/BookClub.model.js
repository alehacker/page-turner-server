const { Schema, model } = require("mongoose");

const bookClubSchema = new Schema(
  {
    name: String,
    description: String,
   //  clubImg: String,
    meetingLink: String,
    schedule: String,
    creator: {type: Schema.Types.ObjectId, ref: "User"},
    currentBook: [{type: Schema.Types.ObjectId, ref: "Book"}],
    bookCollection: [{type: Schema.Types.ObjectId, ref: "Book"}],
    members: [{type: Schema.Types.ObjectId, ref: "User"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const BookClub = model("BookClub", bookClubSchema);

module.exports = BookClub;