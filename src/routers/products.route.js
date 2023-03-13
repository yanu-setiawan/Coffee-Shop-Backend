const { Router } = require("express");

const productsController = require("../controllers/products.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../controllers/auth.controller");

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:id", productsController.getProductDetail);
productsRouter.post(
  "/",
  checkToken,
  checkRole,
  productsController.insertProducts
);
productsRouter.patch(
  "/:id",
  checkToken,
  checkRole,
  productsController.updateProducts
);
productsRouter.delete(
  "/:id",
  checkToken,
  checkRole,
  productsController.deleteProducts
);

module.exports = productsRouter;
