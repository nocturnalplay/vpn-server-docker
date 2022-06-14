const mongoose = require("mongoose");

const user = mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  number: {
    type: Number,
    required: true,
    unique: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  }
});

mongoose.models = {};
const users = mongoose.model("users", user);
module.exports = users;
