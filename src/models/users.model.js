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

// const getEmail = (body) => {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT u.id,u.email FROM users u WHERE id = $1";
//     db.query(sql, [body.email], (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

const insertUsers = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into users (email, password, phone_number,role_id ) values ($1, $2, $3,2) RETURNING *";
    const values = [data.email, data.password, data.phone_number];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.rows);
    });
  });
};

const insertProfile = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "insert into users_profile (user_id) values ($1)";
    const values = [id];
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
const getEmail = (email) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as sum FROM users WHERE email = $1";
    const values = [email];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getPhone = (phone_number) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT count(*) as sum FROM users WHERE phone_number = $1";
    const values = [phone_number];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getUserProfile = (params) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.email, u.phone_number, up.address, up.display_name, up.first_name, up.last_name, up.birth_date, up.image,up.gender
    FROM users_profile up 
    JOIN users u on u.id = up.user_id
    WHERE u.id = $1;`;
    const values = [params.id];
    db.query(sql, values, (error, result) => {
      if (error) {
        console.log(error);
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const updateProfile = (params, body, fileLink) => {
  return new Promise((resolve, reject) => {
    const updateEntries = {};
    const values = [];
    let setClause = "";

    // Cek apakah field name_product ada pada body
    if (body.first_name) {
      updateEntries.first_name = body.first_name;
      values.push(body.first_name);
      setClause += "first_name = $" + values.length + ", ";
    }

    if (body.last_name) {
      updateEntries.last_name = body.last_name;
      values.push(body.last_name);
      setClause += "last_name = $" + values.length + ", ";
    }

    if (body.display_name) {
      updateEntries.display_name = body.display_name;
      values.push(body.display_name);
      setClause += "display_name = $" + values.length + ", ";
    }
    if (body.address) {
      // Jika ada, tambahkan field address dan value-nya ke objek updateEntries
      updateEntries.address = body.address;
      values.push(body.address);
      setClause += "address = $" + values.length + ", ";
    }
    // Cek apakah field price ada pada body
    if (body.gender) {
      // Jika ada, tambahkan field gender dan value-nya ke objek updateEntries
      updateEntries.gender = body.gender;
      values.push(body.gender);
      setClause += "gender = $" + values.length + ", ";
    }
    // Cek apakah field category_id ada pada body
    if (body.birth_date) {
      updateEntries.birth_date = body.birth_date;
      values.push(body.birth_date);
      setClause += "birth_date = $" + values.length + ", ";
    }

    // Cek apakah fileLink (path ke file gambar) ada
    if (fileLink) {
      updateEntries.image = fileLink;
      values.push(fileLink);
      setClause += "image = $" + values.length + ", ";
    }

    // Hilangkan trailing comma dan space pada setClause
    setClause = setClause.slice(0, -2);

    // Push value params.id (id produk yang akan diupdate) ke dalam array values
    values.push(params.id);

    // Bangun string SQL dengan menggunakan setClause dan parameter values
    const sql =
      "UPDATE users_profile SET " +
      setClause +
      " WHERE user_id = $" +
      values.length +
      " RETURNING *";

    // Eksekusi query ke database dengan menggunakan string SQL dan parameter values
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      // Resolve dengan hasil query (updated product)
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
  getEmail,
  insertProfile,
  getPhone,
  getUserProfile,
  updateProfile,
};
