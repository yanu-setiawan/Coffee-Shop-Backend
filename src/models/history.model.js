const db = require("../configs/postgre");

// const getHistory = () => {
//   return new Promise((resolve, reject) => {
//     db.query(
//       `select history.id ,users.email ,products.name_product,product_sizes.size,products.price ,deliveries.delivery_type  ,date_transaction  from history
//       join users on history.id_user = users.id join products on history.id_product =products.id  join deliveries on history.status  = deliveries.id join product_sizes on history.size_id  =product_sizes.id `,
//       (err, result) => {
//         if (err) {
//           reject(err);
//           return;
//         }
//         resolve(result);
//       }
//     );
//   });
// };

const getHistory = (q) => {
  return new Promise((resolve, reject) => {
    const values = ["%" + (q.searchByName || "") + "%" || "%"];
    let sql =
      "select history.id ,users.email ,products.name_product,product_sizes.size,products.price ,deliveries.delivery_type  ,date_transaction  from history join users on history.id_user = users.id join products on history.id_product =products.id  join deliveries on history.status  = deliveries.id join product_sizes on history.size_id  =product_sizes.id WHERE name_product ILIKE $1 ORDER BY  ";
    let order = "id ASC";
    if (q.order === "cheapest") {
      order = "price ASC";
    }
    if (q.order === "priciest") {
      order = "price DESC";
    }
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

const getHistoryDetail = (h) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from history WHERE id = $1";
    const values = [h.id];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const insertHistory = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into history (id_user ,id_product ,size_id, status, date_transaction) values ($1 ,$2 ,$3 ,$4, $5) RETURNING *";
    const values = [
      data.id_user,
      data.id_product,
      data.size_id,
      data.status,
      data.date_transaction,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateHistory = (params, body) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE history SET id_user = $1, id_product = $2, status= $3, date_transaction=$4 WHERE id = $5 RETURNING* ";
    const values = [
      body.id_user,
      body.id_product,
      body.status,
      body.date_transaction,
      params.id,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteHistory = (d) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM history where id = $1";
    const values = [d.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getHistory,
  getHistoryDetail,
  insertHistory,
  updateHistory,
  deleteHistory,
};
