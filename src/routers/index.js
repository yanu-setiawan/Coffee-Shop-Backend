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
//profile
// const profileRouter = require("./profile.route");
//
const commentsRouter = require("./comments.route");
//
const errorController = require("../controllers/error.controller");

const masterRouter = Router();

masterRouter.use("/", welcomeRouter);
masterRouter.use("/users", usersRouter);
masterRouter.use("/auth", authRouter);
masterRouter.use("/transactions", transactionRouter);
masterRouter.use("/products", productsRouter);
masterRouter.use("/promo", promoRouter);
// masterRouter.use("/profile", profileRouter);
masterRouter.use("/history", historyRouter);
masterRouter.use("/comments", commentsRouter);
masterRouter.get("/error", errorController.getError);
masterRouter.post("/error", errorController.createError);

module.exports = masterRouter;
