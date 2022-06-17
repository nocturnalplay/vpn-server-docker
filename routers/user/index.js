const express = require("express");
const router = express.Router();
const vpnuser = require("../../models/uservpnmodel");
const userCredential = require("../../models/usercrdentialmodel");
const tokenfilter = require("../../components/tokenfilter");

router.get("/vpnqr", async (req, res) => {
  const token = tokenfilter(req.headers.cookie);
  const validuser = await userCredential.findOne({ token });
  if (validuser) {
    const vuser = await vpnuser.findOne({ userid: validuser.userid });
    res.sendFile(`${process.cwd()}/${vuser.vpn_qr}`);
    // res.send("user connect");
  } else {
    res.status(401).send({ success: false, msg: "Unauthorized" });
  }
});

router.get("/vpnwg", async (req, res) => {
  const token = tokenfilter(req.headers.cookie);
  const validuser = await userCredential.findOne({ token });
  if (validuser) {
    const vuser = await vpnuser.findOne({ userid: validuser.userid });
    res.download(`${process.cwd()}/${vuser.vpn_wg}`);
    // res.send("user connect");
  } else {
    res.status(401).send({ success: false, msg: "Unauthorized" });
  }
});

module.exports = router;
