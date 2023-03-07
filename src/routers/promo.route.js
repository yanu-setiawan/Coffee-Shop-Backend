const { Router } = require("express");

const promoController = require("../controllers/promo.controller");

const promoRouter = Router();

promoRouter.get("/", promoController.getPromo);
promoRouter.get("/:id", promoController.getPromoDetail);
promoRouter.post("/", promoController.insertPromo);
promoRouter.patch("/:id", promoController.updatePromo);
promoRouter.delete("/:id", promoController.deletePromo);

module.exports = promoRouter;
