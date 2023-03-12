const { Router } = require("express");

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");

const authRouter = Router();

// /auth
// login => post request
authRouter.post("/", authController.login);
//private
authRouter.get(
  "/private",
  authMiddleware.checkToken,
  authController.privateAccess
);
//edit password / update req
authRouter.patch("/", authMiddleware.checkToken, authController.editPassword);
authRouter.patch("/forgot", authController.forgotPassword);

module.exports = authRouter;
