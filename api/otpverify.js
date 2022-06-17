const mongoose = require("mongoose");
const usercridentials = require("../models/usercrdentialmodel");

const { createHmac } = require("crypto");
const secret = "%^&*";
const TIME = 120000;

async function Handler(req, res) {
  try {
    const { id } = req.query;
    const { otp } = req.body;

    if (otp) {
      const finduser = await usercridentials.findOne({
        userid: mongoose.Types.ObjectId(id)
      });
      if (finduser) {
        const timevalied =
          new Date().getTime() - parseInt(finduser.otpcreatedtime);
        if (TIME - timevalied > 0) {
          if (finduser.otp == otp) {
            const token = createHmac("sha512", secret)
              .update(`${finduser._id.toString()}.${new Date().getTime()}`)
              .digest("hex");
            console.log(token);
            await usercridentials.findOneAndUpdate(
              { userid: mongoose.Types.ObjectId(id) },
              { otp: null, active: true, token }
            );
            res.status(200).send({
              success: true,
              msg: "user successfully verified",
              token
            });
          } else {
            throw new Error("Invalied OTP");
          }
        } else {
          throw new Error("OTP Expired");
        }
      } else {
        throw new Error("Invalied user");
      }
    } else {
      throw new Error("OTP required");
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
}

module.exports = Handler;
