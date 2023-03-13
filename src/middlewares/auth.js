const jwt = require("jsonwebtoken");
const authModel = require("../models/auth.model");
const { jwtSecret } = require("../configs/environment");

const checkToken = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken)
    return res.status(403).json({
      msg: "Silahkan Login Terlebih Dahulu",
    });
  const token = bearerToken.split(" ")[1];
  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err && err.name)
      return res.status(403).json({
        msg: err.message,
      });
    if (err)
      return res.status(500).json({
        msg: "Internal Server Error",
      });
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

module.exports = {
  checkToken,
  checkRole,
};
