const UserModel = require("../models/usermodel")
const usercridentials = require("../models/usercrdentialmodel")
const mailer = require('../middleware/mailer')

const { createHmac } = require("crypto");
const secret = "#@!$";

const signin =async (req, res) => {
    try {
        const { password, username } = req.body;
        const hash = createHmac("sha256", secret).update(password).digest("hex");
        if (username && password) {
          const finduser = await UserModel.findOne({ username, password: hash });
          if (finduser) {
            const otp = Math.floor(Math.random() * 899999 + 100000);
            const d = await usercridentials.findOneAndUpdate(
              { userid: finduser._id },
              { otp, otpcreatedtime: new Date().getTime() }
            );
            //mailer function
            mailer(finduser, otp,"otp");
            res.status(200).send({
              success: true,
              msg: "OTP successfully sent your Mail ID",
              id: finduser._id
            });
          } else {
            throw new Error("username or password incorrect");
          }
        } else {
          throw new Error("username and password required");
        }
      } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
      }
};

module.exports = signin;
