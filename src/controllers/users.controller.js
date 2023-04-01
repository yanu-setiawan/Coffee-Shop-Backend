/* eslint-disable no-undef */
const usersModel = require("../models/users.model");
const bcrypt = require("bcrypt");
const { error } = require("../utils/response");
const { uploader } = require("../utils/cloudinary");

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

// const getUserDetail = async (req, res) => {
//   try {
//     const { params } = req;
//     const result = await usersModel.getUserDetail(params);
//     if (result.rows.length === 0) {
//       res.status(404).json({
//         data: result.rows,
//         msg: "User not found",
//       });
//       return;
//     }
//     res.status(200).json({
//       data: result.rows,
//     });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({
//       msg: "Internal Server Error",
//     });
//   }
// };

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
// const changePassword = require("./changePassword");

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { old_password, new_password } = req.body;

    await usersModel.changePassword(
      { id: userId },
      { old_password, new_password }
    );

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error cuy",
    });
  }
};

// module.exports = changePasswordController;

const getUserProfile = async (req, res) => {
  try {
    const { params } = req;
    const result = await usersModel.getUserProfile(params);

    if (result.rows.length < 1) {
      return error(res, { status: 404, msg: "Data Not Found" });
    }
    res.status(200).json({
      data: result.rows,
    });
  } catch (err) {
    return error(res, { status: 500, message: "Internal Server Error" });
  }
};

const cloudUpload = async (req, res) => {
  try {
    // upload ke cloud
    const { params } = req;
    const { data, err, msg } = await uploader(req, "product", params.id);
    if (err) throw { msg, err };
    if (!data) return res.status(200).json({ msg: "No File Uploaded" });
    return data;
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
  // console.log(error)
};

const updateProfile = async (req, res) => {
  try {
    let fileLink;
    if (req.file) {
      // Unggah file ke cloud
      const cloudResult = await cloudUpload(req, res, {
        prefix: "profile",
        id: req.params.id,
      });
      fileLink = cloudResult.secure_url;
    }

    const { params, body } = req;
    if (
      !fileLink &&
      !body.first_name &&
      !body.last_name &&
      !body.display_name &&
      !body.address &&
      !body.birth_date &&
      !body.gender &&
      !body.email &&
      !body.phone_number
    ) {
      // Jika tidak ada perubahan yang diberikan, maka kembalikan response kosong
      return res.status(200).json({
        data: [],
        msg: "Tidak ada perubahan yang dilakukan",
      });
    }
    const result = await usersModel.updateProfile(params, body, fileLink); // sertakan fileLink pada pemanggilan productModel.updateProducts
    const resultContacts = await usersModel.updateContacts(params, body);
    res.status(200).json({
      ...result.rows[0],
      email: resultContacts.rows[0].email,
      phone_number: resultContacts.rows[0].phone_number,
      msg: "Update Berhasil",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      msg: "Internal server error",
    });
  }
};

const insertUsers = async (req, res) => {
  try {
    // Cek apakah email sudah terdaftar
    const emailExists = await usersModel.getEmail(req.body.email);
    if (emailExists.rows[0].sum > 0) {
      return res.status(400).json({
        msg: "Email / Phone Number sudah terdaftar",
      });
    }
    const phoneExists = await usersModel.getPhone(req.body.phone_number);
    if (phoneExists.rows[0].sum > 0) {
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
    await usersModel.insertProfile(result[0].id);
    res.status(201).json({
      data: result,
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
  // getUserDetail,
  insertUsers,
  updateUser,
  deleteUser,
  getUserProfile,
  updateProfile,
  changePassword,
};
