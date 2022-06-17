const mongoose = require("mongoose");

const uservpn = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    trim: true,
    required: true,
    unique: true
  },
  sshusername: {
    type: String,
    trim: true,
    unique: true
  },
  sshpassword: {
    type: String,
    trim: true,
    unique: true
  },
  createdtime: {
    type: String,
    trim: true
  },
  user_ip: {
    type: String,
    trim: true,
    unique: true
  },
  docker_ip: {
    type: String,
    trim: true,
    unique: true
  },
  vpn_qr: {
    type: String,
    trim: true,
    unique: true
  },
  vpn_wg: {
    type: String,
    trim: true,
    unique: true
  }
});

mongoose.models = {};
const uservpns = mongoose.model("uservpns", uservpn);
module.exports = uservpns;
