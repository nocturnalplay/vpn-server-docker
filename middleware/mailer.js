const nodemailer = require("nodemailer");

const otpmail = (email, username, otp) => ({
  from: `${process.env.EMAIL}`,
  to: email,
  subject: "Verify Your Login",
  text: "E-mail Authentication",
  html: `<h1 style='text-transform: capitalize;'>welcome ${username}</h1><h2>Login OTP:${otp}</h2>`
});

const forgotpassword = (email, username, url) => ({
  from: `${process.env.EMAIL}`,
  to: email,
  subject: "Change your password",
  text: "E-mail Authentication",
  html: `<h1 style='text-transform: capitalize;'>welcome ${username}</h1><h2>change your password</h2><span>${url}</span>`
});

async function mailer(user, data, event) {
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
      user: `${process.env.EMAIL}`,
      pass: `${process.env.EPASS}`
    }
  });
  // E-mail formate
  let mailOptions =
    event === "otp"
      ? otpmail(email, username, data)
      : event === "password"
      ? forgotpassword(email, username, data)
      : "";
  console.log(mailOptions);
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
