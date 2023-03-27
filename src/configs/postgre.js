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
});

module.exports = postgre;
