const db = require("../configs/postgre");

const getProducts = (q) => {
  return new Promise((resolve, reject) => {
    const values = ["%" + (q.searchByName || "") + "%" || "%"];
    let sql =
      "select p.id ,p.name_product ,p.price, c.name from  products p join categories c on p.category_id = c.id WHERE name_product ILIKE $1 ORDER BY  ";
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

const getProductDetail = (p) => {
  return new Promise((resolve, reject) => {
    const sql = "select * from products WHERE id = $1";
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

const insertProducts = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into products (name_product, price,category_id) values ($1, $2, $3) RETURNING *";
    const values = [data.name_product, data.price, data.category_id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const updateProducts = (params, body) => {
  return new Promise((resolve, reject) => {
    const sql =
      "UPDATE products SET name_product = $1, price = $2, category_id= $3 WHERE id = $4";
    const values = [body.name_product, body.price, body.category_id, params.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteProducts = (d) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM products where id = $1";
    const values = [d.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getProducts,
  insertProducts,
  getProductDetail,
  updateProducts,
  deleteProducts,
};
