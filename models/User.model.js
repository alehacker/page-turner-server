const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    email: {
    type: String,
    required: true,
    unique: true
    },
    password: {
      type: String,
      required: true,
    },
    profile_image: String,
    bookCollection: [{type: Schema.Types.ObjectId, ref: "Book"}],
    bookClubs: [{type: Schema.Types.ObjectId, ref: "BookClub"}]
  },
  {
    timeseries: true,
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;