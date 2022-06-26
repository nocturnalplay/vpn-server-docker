const express = require("express");
const router = express.Router();
const Signin = require("../../api/signin");
const Signup = require("../../api/signup");
const otpverify = require("../../api/otpverify");
const resendotp = require("../../api/resendotp");
const changepassword = require("../../api/changepassword");
const forgotpassword = require("../../api/forgotpassword");
const userCredential = require("../../models/usercrdentialmodel");

// Home page route.
router.get("/", async (req, res) => {
  const token = req.headers.authorization;
  try {
    const verify = await userCredential.findOne({ token });
    if (verify) {
      res.status(200).send({ success: true, msg: "verified user" });
    } else {
      throw new Error("Token not valied");
    }
  } catch (error) {
    res.status(400).send({ success: false, msg: error.message });
  }
});
router.post("/signin", Signin);
router.post("/signup", Signup);
router.post("/otpverify", otpverify);
router.post("/resendotp", resendotp);
router.post("/forgotpassword", forgotpassword);
router.post("/changepassword", changepassword);
module.exports = router;
