const { Router } = require("express");

const { checkToken } = require("../middlewares/auth");
const transactionsController = require("../controllers/transactions.controller");

const transactionsRouter = Router();

// /transactions
transactionsRouter.post(
  "/",
  checkToken,
  transactionsController.createTransaction
);

transactionsRouter.get("/", checkToken, transactionsController.getHistory);
module.exports = transactionsRouter;

module.exports = transactionsRouter;
