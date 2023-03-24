/* eslint-disable no-unused-vars */
const { comments, error } = require("../configs/mongodb");

const logError = async (req, res) => {
  try {
    const result = await error.insertOne(req.body);
    res.status(201).json({
      msg: "OK",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  logError,
};
