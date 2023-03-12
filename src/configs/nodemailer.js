const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "yanusetiawan363@gmail.com",
    pass: "GkjUWmCJAsX679R4",
  },
});

module.exports = transporter;
