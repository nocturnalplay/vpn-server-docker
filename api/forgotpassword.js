const mongoose = require("mongoose");
const UserModel = require("../models/usermodel");
const usercridentials = require("../models/usercrdentialmodel");
const mailer = require("../middleware/mailer");

const { createHmac } = require("crypto");
const secret = "(*)";

async function Handler(req, res) {
  try {
    const { email } = req.body;
    const finduser = await UserModel.findOne({
      email
    });
    if (finduser) {
      const hash = createHmac("sha512", secret)
        .update(`${finduser._id.toString()}.${new Date().getTime()}`)
        .digest("hex");
      const d = await usercridentials.findOneAndUpdate(
        { userid: finduser._id },
        { mailhash: hash }
      );
      //mailer function
      mailer(
        finduser,
        `${process.env.CLIENT}/changepassword/${hash}`,
        "password"
      );
      res.status(200).send({
        success: true,
        msg: "Mail has been send to your mailid. verify it",
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
