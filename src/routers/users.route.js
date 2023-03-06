const { Router } = require("express");

const usersController = require("../controllers/users.controller");

const usersRouter = Router();

// localhost/users
usersRouter.get("/", usersController.getUsers);
usersRouter.get("/:id", usersController.getUserDetail);
usersRouter.post("/", usersController.insertUsers);
usersRouter.put("/", usersController.updateUser);
usersRouter.put("/:id", usersController.updateUser);
usersRouter.delete("/:id", usersController.deleteUser);

module.exports = usersRouter;
