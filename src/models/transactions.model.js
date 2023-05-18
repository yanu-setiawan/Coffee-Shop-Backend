const db = require("../configs/postgre");

const createTransaction = (client, body, userId) => {
  return new Promise((resolve, reject) => {
    const { notes, status_id, promo_id, payment_id, delivery_id } = body;
    const sql =
      "INSERT INTO transactions (user_id, notes, status_id, promo_id, payment_id, delivery_id) values ($1, $2, $3, $4, $5, $6) RETURNING id";
    const values = [
      userId,
      notes,
      status_id,
      promo_id,
      payment_id,
      delivery_id,
    ];
    client.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const createDetailTransaction = (client, body, transactionId) => {
  return new Promise((resolve, reject) => {
    const { products } = body;
    let sql =
      "INSERT INTO transaction_product_sizes (transaction_id, product_id, size_id, qty, subtotal) VALUES ";
    let values = [];
    products.forEach((product, i) => {
      const { product_id, size_id, qty, subtotal } = product;
      if (values.length) sql += ", ";
      sql += `($${1 + 5 * i}, $${2 + 5 * i}, $${3 + 5 * i}, $${4 + 5 * i}, $${
        5 + 5 * i
      })`;
      values.push(transactionId, product_id, size_id, qty, subtotal);
    });
    client.query(sql, values, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const getTransaction = (client, transactionId) => {
  return new Promise((resolve, reject) => {
    const sql = `select u.email,up.address,p.name_product  as "product", ps."size"  , pr.code  as "promo", py."method" as "payment_method", 
    st."name"  as "transaction_status", tps.qty , tps.subtotal  
    from transaction_product_sizes tps  
    join transactions t on transaction_id  = t.id  
    join products p on product_id  = p.id  
    join product_sizes ps  on size_id  = ps.id  
    join users u on u.id = t.user_id  
    join users_profile up on u.id = t.user_id
    join payments py on py.id  = t.payment_id 
    join promos pr on pr.id = t.promo_id 
    join status st on st.id = t.status_id
    where t.id  = $1;`;
    client.query(sql, [transactionId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

const getHistories = (info) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT DISTINCT ON (t.id) t.id, d.delivery_method, t.created_at, tps.product_id, p.name_product, p.price, p.image
      FROM transactions t
      JOIN deliveries d ON d.id = t.delivery_id
      JOIN transaction_product_sizes tps ON tps.transaction_id = t.id
      JOIN products p ON p.id = tps.product_id
 WHERE user_id = $1`;
    db.query(sqlQuery, [info.id], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const getReport = () => {
  return new Promise((resolve, reject) => {
    const sqlQuery = `SELECT 
    TRIM(TO_CHAR(months.month, 'Month')) AS month,
    COALESCE(SUM(tps.subtotal), 0) AS total_sum
FROM 
    generate_series(
        DATE_TRUNC('month', NOW() - INTERVAL '6 months'),
        DATE_TRUNC('month', NOW()),
        '1 month'
    ) AS months(month)
LEFT JOIN 
    transactions AS t ON DATE_TRUNC('month', t.created_at) = months.month
    LEFT JOIN transaction_product_sizes AS tps ON t.id = tps.transaction_id
GROUP BY 
    months.month
ORDER BY
    months.month;

`;
    db.query(sqlQuery, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const deleteHistory = (client, info) => {
  return new Promise((resolve, reject) => {
    const sqlQuery = "DELETE FROM transactions WHERE id = $1";
    client.query(sqlQuery, [info.params.id], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

const deleteTransaction = (client, info) => {
  return new Promise((resolve, reject) => {
    const sqlQuery =
      "DELETE FROM transaction_product_sizes WHERE transaction_id = $1";
    client.query(sqlQuery, [info.params.id], (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

module.exports = {
  createTransaction,
  createDetailTransaction,
  getTransaction,
  getHistories,
  deleteTransaction,
  deleteHistory,
  getReport,
};
