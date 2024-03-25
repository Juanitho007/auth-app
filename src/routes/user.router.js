const {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  getLoggedUser,
  createAdmin,
  resetPassword,
  changePassword,
} = require("../controllers/user.controllers.js");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT.js");

const userRouter = express.Router();

userRouter.route("/users")
  .get(verifyJWT, getAll)
  .post(create);

userRouter.route('/users/admin')
  .post(createAdmin);

userRouter.route("/users/login")
  .post(login);

userRouter.route("/users/reset_Password")
  .post(resetPassword)

userRouter.route("/users/me")
  .get(verifyJWT, getLoggedUser);

userRouter
  .route("/users/:id")
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

userRouter.route("/users/reset_Password/:code")
  .post(changePassword);

module.exports = userRouter;
