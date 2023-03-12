const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendToMail } = require("../helpers/sendMailer");
const authModel = require("../models/auth.model");
// eslint-disable-next-line no-unused-vars
const { jwtSecret, user } = require("../configs/environment");

const login = async (req, res) => {
  try {
    const { body } = req;
    const result = await authModel.userVerification(body.email);
    if (result.rows.length < 1)
      return res.status(401).json({
        msg: "Email/Password Salah",
      });
    const { id, email, password, role_id } = result.rows[0];
    const isPasswordValid = await bcrypt.compare(body.password, password);
    console.log(isPasswordValid);
    if (!isPasswordValid)
      return res.status(401).json({
        msg: "Email/Password Salah",
      });

    const payload = {
      id,
      email,
      role_id,
    };
    const jwtOptions = {
      expiresIn: "5m",
    };
    jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        msg: "Selamat Datang",
        token,
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const privateAccess = (req, res) => {
  const { id, email, role_id } = req.authInfo;
  res.status(200).json({
    payload: { id, email, role_id },
    msg: "OK",
  });
};

const editPassword = async (req, res) => {
  const { authInfo, body } = req;
  try {
    const result = await authModel.getPassword(authInfo.id);
    const passFromDb = result.rows[0].password;
    const isPasswordValid = await bcrypt.compare(body.oldPassword, passFromDb);
    if (!isPasswordValid)
      return res.status(403).json({
        msg: "Password Lama Salah",
      });
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    await authModel.editPassword(hashedPassword, authInfo.id);
    res.status(200).json({
      msg: "Edit Password Success",
      //   token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const checkEmail = await authModel.userVerification(email);
    console.log(checkEmail);
    // console.log(checkEmail.email);
    if (!checkEmail) {
      return res.status(404).json({ msg: "Email not found" });
    }

    const data = {
      name: "Pelanggan Setia Coffee Shop",
      to: checkEmail.rows[0].email,
      subject: "Reset Password",
      template: "template.html",
    };
    console.log(data.to);
    const result = await sendToMail(data);
    return res.status(200).json({
      status: 200,
      msg: "Sent!, Please check your email account",
      receiver: result.envelope.to,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};

module.exports = {
  login,
  privateAccess,
  editPassword,
  forgotPassword,
};
