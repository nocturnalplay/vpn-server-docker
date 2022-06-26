const mongoose = require("mongoose");
const usercridentials = require("../models/usercrdentialmodel");
const UserModel = require("../models/usermodel");

const { createHmac } = require("crypto");
const secret = "#@!$";

async function Handler(req, res) {
  try {
    const { id } = req.query;
    const { password } = req.body;
    const finduser = await usercridentials.findOne({
      mailhash: id
    });
    if (finduser) {
      const hash = createHmac("sha256", secret).update(password).digest("hex");
      const d = await UserModel.findOneAndUpdate(
        { _id: finduser.userid },
        { password: hash }
      );

      res.status(200).send({
        success: true,
        msg: "password changed successfully"
      });
    } else {
      throw new Error("User ID Invalid");
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

module.exports = Handler;
