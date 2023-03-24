/* eslint-disable no-undef */
module.exports = {
  host: process.env.DB_HOST,
  db: process.env.DB_DATABASE,
  dbPort: process.env.DB_PORT,
  user: process.env.DB_USER,
  pwd: process.env.DB_PWD,
  serverPort: process.env.SERVER_PORT,
  jwtSecret: process.env.JWT_SECRET,
  mongoPass: process.env.MONGO_PWD,
  mongoDbName: process.env.MONGO_DBNAME,
  mongoDbUser: process.env.MONGO_USER,
  mongoDbHost: process.env.MONGO_HOST,
  cloudinaryName: process.env.CLOUD_NAME,
  cloudinaryKey: process.env.CLOUD_KEY,
  cloudinarySecret: process.env.CLOUD_SECRET,
};
