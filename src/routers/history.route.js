const { Router } = require("express");

const historyController = require("../controllers/history.controller");

const historyRouter = Router();

historyRouter.get("/", historyController.getHistory);
historyRouter.get("/:id", historyController.getHistoryDetail);
historyRouter.post("/", historyController.insertHistory);
historyRouter.patch("/:id", historyController.updateHistory);
historyRouter.delete("/:id", historyController.deleteHistory);

module.exports = historyRouter;
