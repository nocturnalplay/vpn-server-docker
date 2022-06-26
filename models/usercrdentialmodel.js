const mongoose = require("mongoose");

const usercridential = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true,
    unique: true
  },
  otp: {
    type: Number,
    default: null
  },
  otpcreatedtime: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    trim: true,
    default: null
  },
  roll: {
    type: String,
    default: "VIEW",
    trim: true,
    enum: ["VIEW", "ADMIN"]
  },
  mailhash: {
    type: String,
    trim: true,
    default: null
  }
});

mongoose.models = {};
const usercridentials = mongoose.model("usercridentials", usercridential);
module.exports = usercridentials;
