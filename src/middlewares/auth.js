const jwt = require("jsonwebtoken");

const { jwtSecret } = require("../configs/environment");

const checkToken = (req, res, next) => {
  // ambil token dari Header
  const bearerToken = req.header("Authorization");
  // verifikasi token
  if (!bearerToken)
    return res.status(403).json({
      msg: "Silahkan Login Terlebih Dahulu",
    });
  const token = bearerToken.split(" ")[1]; // ["Bearer", "token"]
  jwt.verify(token, jwtSecret, (err, payload) => {
    // jika tidak, maka tolak akses
    if (err && err.name)
      // error jwt
      return res.status(403).json({
        msg: err.message,
      });
    if (err)
      // generic error
      return res.status(500).json({
        msg: "Internal Server Error",
      });
    // jika valid, maka lanjut ke controller
    // attach payload ke object request
    req.authInfo = payload;
    next();
  });
};

// const checkRole = (req, res, next) => {
//   next();
// };

module.exports = {
  checkToken,
};
