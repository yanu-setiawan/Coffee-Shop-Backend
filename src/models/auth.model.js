// const { token } = require("morgan");
const db = require("../configs/postgre");

const userVerification = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT id,email,password,role_id FROM users  WHERE email=$1";
    db.query(sql, [email], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getPassword = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT u.password FROM users u WHERE id = $1";
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const editPassword = (newPassword, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET password = $1 WHERE id = $2";
    db.query(sql, [newPassword, userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getRole = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT u.id,u.role_id FROM users u WHERE id = $1";
    db.query(sql, [userId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const createOtp = (email, otp) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users set otp = $1 WHERE email =$2 RETURNING otp";
    const values = [otp, email];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getOtp = (email) => {
  return new Promise((resolve, reject) => {
    const sql = " SELECT otp FROM users WHERE email = $1";
    db.query(sql, [email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const forgotPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users set password =$1 where email= $2";
    db.query(sql, [password, email], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const getToken = (userId, token) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE users SET token=$1 WHERE id=$2";
    const values = [token, userId];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  userVerification,
  getPassword,
  editPassword,
  getRole,
  createOtp,
  getOtp,
  forgotPassword,
  getToken,
};
