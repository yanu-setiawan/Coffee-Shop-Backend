const { Pool } = require("pg");
// client
// pool

const { host, db, dbPort, user, pwd } = require("./environment");

const postgre = new Pool({
  host,
  database: db,
  port: dbPort,
  user,
  password: pwd,
  //   connectionString: "postgresql://fakhri:fakhri@localhost:5433/kopi_toko",
});

module.exports = postgre;
