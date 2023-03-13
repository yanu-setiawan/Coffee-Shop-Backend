const jwt = require("jsonwebtoken");

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

module.exports = {
  checkToken,
};
