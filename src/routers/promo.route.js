const { Router } = require("express");

const promoController = require("../controllers/promo.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/auth");

const promoRouter = Router();

promoRouter.get("/", promoController.getPromo);
promoRouter.get("/:id", promoController.getPromoDetail);
promoRouter.post("/", checkToken, checkRole, promoController.insertPromo);
promoRouter.patch("/:id", checkToken, checkRole, promoController.updatePromo);
promoRouter.delete("/:id", checkToken, checkRole, promoController.deletePromo);

module.exports = promoRouter;
