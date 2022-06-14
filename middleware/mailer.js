const nodemailer = require("nodemailer");

async function mailer(user, otp) {
  //admin verification for send email
  const { email, username } = user;
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
      ciphers: "SSLv3"
    },
    auth: {
      user: "ccpsslmc@outlook.com",
      pass: "ccps@salemcity"
    }
  });
  // E-mail formate
  let mailOptions = {
    from: "ccpsslmc@outlook.com",
    to: email,
    subject: "Verify Your Login",
    text: "E-mail Authentication",
    html: `<h1 style='text-transform: capitalize;'>welcome ${username}</h1><h2>Login OTP:${otp}</h2>`
  };
  // send mail to the client
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error.message;
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = mailer;
// mailer("<mail to>", "<otp>", "<user id>","<username>");