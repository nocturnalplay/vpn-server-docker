const UserModel = require("../models/usermodel");
const usercridentials = require("../models/usercrdentialmodel");

const { createHmac } = require("crypto");
const secret = "#@!$";

async function Handler(req, res) {
  try {
    const { password, username, number, email } = req.body;
    const hash = createHmac("sha256", secret).update(password).digest("hex");

    const d = await UserModel.create({
      username,
      number,
      email,
      password: hash
    });
    await usercridentials.create({ userid: d._id });
    res.status(200).send({ success: true, msg: "user added successfully" });
  } catch (error) {
    let msg = error.message;

    if (msg.search("duplicate key") > 0) {
      res.status(400).send({ success: false, msg: "values you entered already exist" });
    } else {
      res.status(400).send({ success: false, msg });
    }
  }
}

module.exports = Handler;
