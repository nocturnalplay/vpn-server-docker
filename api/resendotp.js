const mongoose = require("mongoose");
const UserModel = require("../models/usermodel");
const usercridentials = require("../models/usercrdentialmodel");
const mailer = require("../middleware/mailer");

const { createHmac } = require("crypto");
const secret = "#@!$";

async function Handler(req, res) {
  try {
    const { id } = req.query;
    const finduser = await UserModel.findById({
      _id: mongoose.Types.ObjectId(id)
    });
    if (finduser) {
      const otp = Math.floor(Math.random() * 899999 + 100000);
      const d = await usercridentials.findOneAndUpdate(
        { userid: finduser._id },
        { otp, otpcreatedtime: new Date().getTime() }
      );
      //mailer function
      mailer(finduser, otp);
      res.status(200).send({
        success: true,
        msg: "OTP successfully sent your Mail ID",
        id: finduser._id
      });
    } else {
      throw new Error("User ID Invalid");
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

module.exports = Handler;
