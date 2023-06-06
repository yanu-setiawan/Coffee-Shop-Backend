/* eslint-disable no-unused-vars */
const { Router } = require("express");

const usersController = require("../controllers/users.controller");
const { checkToken } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/auth");
// const { singleUpload } = require("../middlewares/diskUpload");
const memoryUpload = require("../middlewares/memoryUpload");
const usersRouter = Router();

// localhost/users
usersRouter.get("/", usersController.getUsers);
// usersRouter.get("/:id", usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);
usersRouter.patch("/:id", usersController.updateUser);
usersRouter.patch("/editPWD/:id", usersController.changePassword);
usersRouter.delete("/:id", usersController.deleteUser);
usersRouter.get("/profile/:id", checkToken, usersController.getUserProfile);

usersRouter.patch(
  "/profile/:id",
  memoryUpload.single("image"),
  //   checkToken,
  usersController.updateProfile
);

module.exports = usersRouter;
