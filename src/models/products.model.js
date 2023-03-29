const db = require("../configs/postgre");

// const getProducts = (q) => {
//   return new Promise((resolve, reject) => {
//     const search =
//       q.searchByName != undefined ? "%" + q.searchByName + "%" : "%";
//     let sql =
//       "select p.id ,p.name_product ,p.price, c.name as category,image from  products p join categories c on p.category_id = c.id WHERE name_product ILIKE $1 ORDER BY  ";
//     let order = "id ASC";
//     if (q.order === "cheapest") {
//       order = "price ASC";
//     }
//     if (q.order === "priciest") {
//       order = "price DESC";
//     }
//     sql += order;

//     const limit = parseInt(q.limit) || 12;
//     const page = parseInt(q.page) || 1;
//     const offset = (page - 1) * limit;
//     const values = [search, limit, offset];
//     console.log(search);
//     console.log(limit);

//     sql += " LIMIT $2 OFFSET $3";
//     console.log(sql);
//     console.log(offset);
//     db.query(sql, values, (error, result) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       resolve(result);
//     });
//   });
// };

const getProducts = (query) => {
  return new Promise((resolve, reject) => {
    let sqlQuery = `select p.id ,p.name_product ,p.price, p.favorite, c.name as category,image  from  products p join categories c on p.category_id = c.id WHERE lower(p.name_product) LIKE lower('%${query.name}%')`;

    if (query.categories) {
      sqlQuery += ` AND p.category_id = ${query.categories}`;
    }

    if (query.favorite) {
      sqlQuery += ` AND p.favorite = ${query.favorite}`;
    }

    let order = "p.id ASC";
    if (query.order === "cheapest") order = "p.price ASC";
    if (query.order === "priciest") order = "p.price DESC";
    if (query.order === "newest") order = "p.id ASC";
    if (query.order === "latest") order = "p.id DESC";

    sqlQuery += ` ORDER BY ${order}`;

    if (query.limit) {
      const limit = parseInt(query.limit) || 12;
      const page = parseInt(query.page) || 1;
      const offset = parseInt(page - 1) * limit;
      sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`;
    }
    db.query(sqlQuery, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

// const getMetaProducts = (q) => {
//   return new Promise((resolve, reject) => {
//     let sql = "select count(*) as total_data from products p";
//     db.query(sql, (error, result) => {
//       if (error) {
//         reject(error);
//         return;
//       }
//       const totalData = parseInt(result.rows[0].total_data);

//       const page = parseInt(q.page) || 1;
//       const limit = parseInt(q.limit) || 12;
//       const totalPage = Math.ceil(totalData / limit);
//       const nextPage = `/products?page=${
//         page + 1 <= totalPage ? page + 1 : null
//       }&limit=${limit} `;

//       const prevPage = `/products?page=${
//         page - 1 > 0 ? page - 1 : null
//       }&limit=${limit}`;

//       let next = nextPage;
//       let prev = prevPage;

//       if (page === 1) prev = null;
//       if (page === totalPage) next = null;
//       const meta = {
//         totalData,
//         next,
//         prev,
//         totalPage,
//       };
//       resolve(meta);
//     });
//   });
// };

const getMetaProducts = (info) => {
  return new Promise((resolve, reject) => {
    console.log(info);
    let sqlQuery = `SELECT COUNT(*) AS total_data FROM products p join categories c on p.category_id = c.id WHERE lower(p.name_product) LIKE lower('%${info.name}%')`;

    if (info.categories) {
      sqlQuery += ` AND p.category_id = ${info.categories}`;
    }

    if (info.favorite) {
      sqlQuery += ` AND p.favorite = ${info.favorite}`;
    }
    db.query(sqlQuery, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(result.rows[0]);
      const totalData = parseInt(result.rows[0].total_data);
      const limit = parseInt(info.limit) || 12;
      const page = parseInt(info.page) || 1;
      const totalPage = Math.ceil(totalData / limit);
      let next = "";
      let prev = "";
      if (page < totalPage) {
        next = `/products?page=${page + 1}&limit=${limit}`;
        if (info.categories) {
          next += `&categories=${info.categories}`;
        }

        if (info.favorite) {
          next += `&favorite=${info.favorite}`;
        }
        if (info.order) {
          next += `&order=${info.order}`;
        }
      } else {
        next = null;
      }

      if (page > 1) {
        prev = `/products?page=${page - 1}&limit=${limit}`;
        if (info.categories) {
          prev += `&categories=${info.categories}`;
        }

        if (info.favorite) {
          prev += `&favorite=${info.favorite}`;
        }
        if (info.order) {
          prev += `&order=${info.order}`;
        }
      } else {
        prev = null;
      }
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
