// ENDPOINT = alat navigasi
const { Router } = require("express");
// welcome /
const welcomeRouter = require("./welcome.route");
// users /users
const usersRouter = require("./users.route");
//products
const productsRouter = require("./products.route");
//promo
const promoRouter = require("./promo.route");
//history
const historyRouter = require("./history.route");
//auth
const authRouter = require("./auth.route");
//transactions
const transactionRouter = require("./transactions.route");
//

const masterRouter = Router();

masterRouter.use("/", welcomeRouter);
masterRouter.use("/users", usersRouter);
masterRouter.use("/auth", authRouter);
masterRouter.use("/transactions", transactionRouter);
masterRouter.use("/products", productsRouter);
masterRouter.use("/promo", promoRouter);
masterRouter.use("/history", historyRouter);

module.exports = masterRouter;
