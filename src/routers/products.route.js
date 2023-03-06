const { Router } = require("express");

const productsController = require("../controllers/products.controller");

const productsRouter = Router();

productsRouter.get("/", productsController.getProducts);
productsRouter.get("/:id", productsController.getProductDetail);
productsRouter.post("/", productsController.insertProducts);
productsRouter.put("/", productsController.updateProducts);
productsRouter.put("/:id", productsController.updateProducts);
productsRouter.delete("/:id", productsController.deleteProducts);

module.exports = productsRouter;
