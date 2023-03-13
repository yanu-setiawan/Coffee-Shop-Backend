const db = require("../configs/postgre");

const getUsers = (q) => {
  return new Promise((resolve, reject) => {
    const values = ["%" + (q.searchByName || "") + "%" || "%"];
    let sql =
      "select id, email, password, phone_number from users  WHERE email ILIKE $1 ORDER BY  ";
    let order = "id ASC";
    if (!isNaN(q.limit)) {
      order += ` limit ${q.limit || 10}`;
    }
    sql += order;

    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const getUserDetail = (u) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from users WHERE id = $1";
    const values = [u.id];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const insertUsers = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into users (email, password, phone_number,role_id ) values ($1, $2, $3,2) RETURNING *";
    const values = [data.email, data.password, data.phone_number];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateUser = (params, body) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE users SET email = $1, password = $2, phone_number = $3 WHERE id = $4 RETURNING*";
    // parameterized query
    const values = [body.email, body.password, body.phone_number, params.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteUser = (u) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM users where id = $1 RETURNING*";
    const values = [u.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getUsers,
  getUserDetail,
  insertUsers,
  updateUser,
  deleteUser,
};
