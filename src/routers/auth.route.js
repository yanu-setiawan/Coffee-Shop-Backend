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
authRouter.patch("/otp", authController.createOTP);
authRouter.patch("/forgot", authController.forgotPassword);
authRouter.delete(
  "/logout",
  authMiddleware.blacklistToken,
  authMiddleware.checkToken
);

module.exports = authRouter;
