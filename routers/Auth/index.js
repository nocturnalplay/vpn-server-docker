const express = require("express");
const router = express.Router();
const Signin = require("../../api/signin");
const Signup = require("../../api/signup");
const otpverify = require("../../api/otpverify");
const resendotp = require("../../api/resendotp");

// Home page route.
router.get("/", (req, res) => {
  res.json({ success: true, msg: "If u can Break the Authentication" });
});
router.post("/signin", Signin);
router.post("/signup", Signup);
router.post("/otpverify", otpverify);
router.post("/resendotp", resendotp);

module.exports = router;
