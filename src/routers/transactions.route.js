const { Router } = require("express");

const { checkToken, checkRole } = require("../middlewares/auth");
const transactionsController = require("../controllers/transactions.controller");

const transactionsRouter = Router();

// /transactions
transactionsRouter.post(
  "/",
  checkToken,
  transactionsController.createTransaction
);

transactionsRouter.get("/", checkToken, transactionsController.getHistory);
transactionsRouter.get(
  "/monthlyReport",
  checkToken,
  transactionsController.getReport
);

transactionsRouter.delete(
  "/:id",
  checkToken,
  transactionsController.deleteTransaction
);

transactionsRouter.get(
  "/get-all-order",
  checkToken,
  checkRole,
  transactionsController.getAllOrders
);
transactionsRouter.get(
  "/get-done-order",
  checkToken,
  checkRole,
  transactionsController.getDoneOrders
);
transactionsRouter.patch(
  "/change-status-order/:id",
  checkToken,
  checkRole,
  transactionsController.changeStatusOrders
);

module.exports = transactionsRouter;

module.exports = transactionsRouter;
