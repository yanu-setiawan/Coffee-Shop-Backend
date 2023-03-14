const db = require("../configs/postgre");

const getProducts = (q) => {
  return new Promise((resolve, reject) => {
    const search =
      q.searchByName != undefined ? "%" + q.searchByName + "%" : "%";
    let sql =
      "select p.id ,p.name_product ,p.price, c.name as category,image from  products p join categories c on p.category_id = c.id WHERE name_product ILIKE $1 ORDER BY  ";
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

      if (page === 1) prev = null;
      if (page === totalPage) next = null;
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

const insertProducts = (body, fileLink) => {
  return new Promise((resolve, reject) => {
    const sql =
      "insert into products (name_product, price,category_id,image) values ($1, $2, $3,$4) RETURNING *";
    const values = [body.name_product, body.price, body.category_id, fileLink];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// const updateProducts = (params, body,fileLink) => {
//   return new Promise((resolve, reject) => {
//     const sql =
//       "UPDATE products SET name_product = $1, price = $2, category_id= $3 ,image = $4 WHERE id = $5 RETURNING*";
//     const values = [body.name_product, body.price, body.category_id,fileLink, params.id];
//     db.query(sql, values, (err, result) => {
//       if (err) return reject(err);
//       resolve(result);
//     });
//   });
// };

const updateProducts = (params, body, fileLink) => {
  return new Promise((resolve, reject) => {
    const updateEntries = {};
    const values = [];
    let setClause = "";

    // Cek apakah field name_product ada pada body
    if (body.name_product) {
      // Jika ada, tambahkan field name_product dan value-nya ke objek updateEntries
      updateEntries.name_product = body.name_product;
      // Push value name_product ke dalam array values
      values.push(body.name_product);
      // Tambahkan 'name_product = $x, ' pada setClause, dimana x adalah index values dari name_product
      setClause += "name_product = $" + values.length + ", ";
    }

    // Cek apakah field price ada pada body
    if (body.price) {
      // Jika ada, tambahkan field price dan value-nya ke objek updateEntries
      updateEntries.price = body.price;
      values.push(body.price);
      setClause += "price = $" + values.length + ", ";
    }

    // Cek apakah field category_id ada pada body
    if (body.category_id) {
      updateEntries.category_id = body.category_id;
      values.push(body.category_id);
      setClause += "category_id = $" + values.length + ", ";
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
      "UPDATE products SET " +
      setClause +
      " WHERE id = $" +
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

const updateImageProducts = (fileLink, id) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE products SET image = $1 WHERE id = $2 RETURNING *";
    db.query(sql, [fileLink, id], (err, result) => {
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
  updateImageProducts,
};
