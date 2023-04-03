const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const { jwtSecret } = require("../configs/environment");
const { error } = require("../utils/response");

const blacklist = [];

const checkToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return error(res, {
      status: 403,
      message: "Silahkan Login Terlebih Dahulu",
    });
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err && err.name)
      return error(res, { status: 403, message: err.message });
    if (err) return error(res, { status: 500, message: err.message });
    req.authInfo = payload;
    next();
  });
};

const checkRole = async (req, res, next) => {
  const { authInfo } = req;
  try {
    const result = await authModel.getRole(authInfo.id);
    const getRoleDb = result.rows[0].role_id;
    if (getRoleDb === 1) {
      next();
    } else {
      return res.status(403).json({
        msg: "Hanya Bisa Diakses Oleh Admin",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 500, msg: "Internal server error" });
  }
};

const blacklistToken = (req, res) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) {
    return res.status(403).json({
      msg: "Please Login...",
    });
  }
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, payload) => {
    blacklist.push(token);
    console.log(blacklist);
    req.authInfo = payload;
    res.status(200).json({
      msg: "Logout Success...",
    });
  });
};

module.exports = {
  checkToken,
  checkRole,
  blacklistToken,
};
