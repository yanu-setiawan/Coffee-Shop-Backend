const db = require("../configs/postgre");

const getProducts = (q) => {
  return new Promise((resolve, reject) => {
    const search =
      q.searchByName != undefined ? "%" + q.searchByName + "%" : "%";
    let sql =
      "select p.id ,p.name_product ,p.price, c.name from  products p join categories c on p.category_id = c.id WHERE name_product ILIKE $1 ORDER BY  ";
    let order = "id ASC";
    if (q.order === "cheapest") {
      order = "price ASC";
    }
    if (q.order === "priciest") {
      order = "price DESC";
    }
    sql += order;

    const limit = parseInt(q.limit) || 5;
    const page = parseInt(q.page) || 1;
    const offset = (page - 1) * limit;
    const values = [search, limit, offset];
    console.log(search);
    console.log(limit);

    sql += " LIMIT $2 OFFSET $3";
    console.log(sql);
    console.log(offset);
    db.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
};

const getMetaProducts = (q) => {
  return new Promise((resolve, reject) => {
    let sql = "select count(*) as total_data from products p";
    db.query(sql, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      const totalData = parseInt(result.rows[0].total_data);
      const page = parseInt(q.page) || 1;
      const limit = parseInt(q.limit) || 5;
      const totalPage = Math.ceil(totalData / limit);
      const nextPage = `/products?page=${
        page + 1 <= totalPage ? page + 1 : null
      }&limit=${limit} `;
      const prevPage = `/products?page=${
        page - 1 > 0 ? page - 1 : null
      }&limit=${limit}`;

      let next = nextPage;
      let prev = prevPage;
      const meta = {
        totalData,
        next,
        prev,
        totalPage,
      };
      resolve(meta);
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
      "UPDATE products SET name_product = $1, price = $2, category_id= $3 WHERE id = $4 RETURNING*";
    const values = [body.name_product, body.price, body.category_id, params.id];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const deleteProducts = (d) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM products where id = $1 RETURNING*";
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
  getMetaProducts,
};
