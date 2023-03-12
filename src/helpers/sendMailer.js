const mailer = require("../configs/nodemailer");
const fs = require("fs");
const mustache = require("mustache");

const sendToMail = (data) => {
  const template = fs.readFileSync(`./src/template/${data.template}`, "utf-8");
  const mailOptions = {
    from: "Owner Coffee Shop <yanusetiawan363@gmail.com>",
    to: data.to,
    subject: "Reset Password",
    html: mustache.render(template, { ...data }),
  };
  return new Promise((resolve, reject) => {
    mailer.sendMail(mailOptions, (err, info) => {
      if (err) {
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};

module.exports = { sendToMail };
