const { logError } = require("../models/error.model");

const error = (res, { status, message }) => {
  // log error ke mongo
  logError({ status, message }, (err) => {
    if (err) return res.status(500).json({ msg: "Internal Server Error" });
    // kirim response
    res.status(status).json({
      msg: message,
    });
  });
};

module.exports = { error };
