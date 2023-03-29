const usersModel = require("../models/users.model");
const bcrypt = require("bcrypt");

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

// const insertUsers = async (req, res) => {
//   try {
//     const result = await usersModel.insertUsers({
//       email: req.body.email,
//       password: bcrypt.hashSync(req.body.password, 10),
//       phone_number: req.body.phone_number,
//     });
//     res.status(201).json({
//       data: result.rows,
//       msg: "User registered successfully!",
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal Server Error cuy",
//     });
//   }
// };

const insertUsers = async (req, res) => {
  try {
    // Cek apakah email sudah terdaftar
    const emailExists = await usersModel.getEmail(req.body.email);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({
        msg: "Email / Phone Number sudah terdaftar",
      });
    }
    // Jika email belum terdaftar, lakukan insert
    const result = await usersModel.insertUsers({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      phone_number: req.body.phone_number,
    });
    // const insertUserProfile = await usersModel.insertProfile(result.id);
    res.status(201).json({
      data: result.rows,
      msg: "User registered successfully!",
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
      data: result.rows,
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
