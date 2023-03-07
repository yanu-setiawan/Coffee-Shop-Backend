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

const insertPromo = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into promo (product_id,coupon, discount) values  ($1, $2, $3) RETURNING *";
    // parameterized query
    const values = [data.product_id, data.coupon, data.discount];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updatePromo = (params, body) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE promo SET product_id = $1, coupon = $2, discount = $3 WHERE id = $4";
    // parameterized query
    const values = [body.product_id, body.coupon, body.discount, params.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deletePromo = (d) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM promo where id = $1";
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
