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

module.exports = {
  userVerification,
  getPassword,
  editPassword,
};
