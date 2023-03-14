const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { sendToMail } = require("../helpers/sendMailer");
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

const createOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const generateOTP = () => {
      const OTP_LENGTH = 4;
      // Define all possible characters
      const chars =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

      let otp = "";
      for (let i = 0; i < OTP_LENGTH; i++) {
        // Pick a random character from the `chars` string
        const randomIndex = Math.floor(Math.random() * chars.length);
        otp += chars[randomIndex];
      }

      return otp;
    };
    const otp = generateOTP().toString();
    const result = await authModel.createOtp(email, otp);
    if (result.rows < 1) {
      res.status(404).json({
        msg: "Email not found!",
      });
    }
    console.log(result.rows[0].otp);
    res.status(200).json({
      msg: "Create Otp",
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
    const { email, otp, password } = req.body;
    const otpFromDb = await authModel.getOtp(email);
    console.log(otpFromDb);
    console.log(otp);
    if (otpFromDb.rows[0].otp !== otp) {
      res.status(404).json({
        msg: "OTP not valid!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await authModel.forgotPassword(email, hashedPassword);
    res.status(200).json({
      msg: "Change Password Success :)",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
  privateAccess,
  editPassword,
  createOTP,
  forgotPassword,
};
