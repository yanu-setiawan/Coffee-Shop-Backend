const { Router } = require("express");

const productsController = require("../controllers/products.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/auth");
const { singleUpload } = require("../middlewares/diskUpload");

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:id", productsController.getProductDetail);
productsRouter.post(
  "/",
  checkToken,
  checkRole,
  singleUpload("image"),
  productsController.insertProducts
);
productsRouter.patch(
  "/:id",
  checkToken,
  checkRole,
  singleUpload("image"),
  productsController.updateProducts
  //   productsController.patchImageProducts
);
productsRouter.delete(
  "/:id",
  checkToken,
  checkRole,
  productsController.deleteProducts
);

// productsRouter.patch(
//   "/:id",
//   checkToken,
//   singleUpload("image"),
//   productsController.patchImageProducts
// );

module.exports = productsRouter;
