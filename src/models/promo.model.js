const db = require("../configs/postgre");

const getPromo = (q) => {
  return new Promise((resolve, reject) => {
    const values = ["%" + (q.searchByName || "") + "%" || "%"];
    let sql =
      "select promo.id ,promo.coupon ,promo.discount  ,products.name_product  from promo join products on promo.product_id = products.id WHERE name_product ILIKE $1 ORDER BY  ";
    let order = "id ASC";
    if (q.order === "biggest") {
      order = "discount DESC";
    }
    if (q.order === "smallest") {
      order = "discount ASC";
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

const getPromoDetail = (p) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from promo WHERE id = $1";
    const values = [p.id];
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

// const insertPromo = (data) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "insert into promos (product_id, code, discount, description, expired_at) VALUES ($1, UPPER($2), $3, $4, $5) RETURNING *";
//     // parameterized query
//     const values = [
//       data.product_id,
//       data.code,
//       data.discount,
//       data.description,
//       data.expired_at,
//     ];
//     db.query(sql, values, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

const insertPromo = (data) => {
  return new Promise((resolve, reject) => {
    const addData =
      "INSERT INTO promos (product_id, code, discount, description, expired_at) VALUES ($1, UPPER($2), $3, $4, $5) RETURNING *";
    const values = [
      data.product_id,
      data.code,
      data.discount,
      data.description,
      data.expired_at,
    ];
    db.query(addData, values, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// const updatePromo = (params, body) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "UPDATE promo SET product_id = $1, coupon = $2, discount = $3 WHERE id = $4 RETURNING*";
//     // parameterized query
//     const values = [body.product_id, body.coupon, body.discount, params.id];
//     db.query(sql, values, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

const updatePromo = (info, data) => {
  return new Promise((resolve, reject) => {
    // const editData = "UPDATE promo SET coupon_code = UPPER($1), discount = $2 WHERE id = $3 RETURNING *";
    // const values = [data.coupon_code, data.discount, info.promoId];

    let editData = "UPDATE promo SET ";
    let values = [];
    let i = 1;
    for (const [key, val] of Object.entries(data)) {
      editData += `${key} = $${i}, `;
      values.push(val);
      i++;
    }
    editData = editData.slice(0, -2);
    editData += ` WHERE id = $${i} RETURNING *`;
    values.push(info.promoId);
    console.log(editData);
    console.log(values);
    db.query(editData, values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

const deletePromo = (d) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM promo where id = $1 RETURNING*";
    const values = [d.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getPromo,
  getPromoDetail,
  insertPromo,
  updatePromo,
  deletePromo,
};
