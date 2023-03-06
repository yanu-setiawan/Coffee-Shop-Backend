const usersModel = require("../models/users.model");

const getUsers = async (req, res) => {
  try {
    const { query } = req;
    const result = await usersModel.getUsers(query);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "User not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const { params } = req;
    const result = await usersModel.getUserDetail(params);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "User not found",
      });
      return;
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

const insertUsers = async (req, res) => {
  try {
    const { body } = req;
    const result = await usersModel.insertUsers(body);
    res.status(202).json({
      data: result.rows,
      msg: "Create User Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { params, body } = req;
    const result = await usersModel.updateUser(params, body);
    if (result.rows.length === 0) {
      res.status(404).json({
        data: result.rows,
        msg: "User not found",
      });
      return;
    }
    res.status(201).json({
      data: result.rows,
      msg: "Update User Success",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { params } = req;
    const result = await usersModel.deleteUser(params);
    res.status(200).json({
      msg: "user Deleted",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

module.exports = {
  getUsers,
  getUserDetail,
  insertUsers,
  updateUser,
  deleteUser,
};
