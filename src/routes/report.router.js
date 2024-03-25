const {
  getAll,
  create,
  getOne,
  remove,
  update
} = require("../controllers/report.controllers.js");
const express = require("express");
const verifyJWT = require("../utils/verifyJWT.js");
const upload = require("../utils/multer.js");

const reportRouter = express.Router();

reportRouter
  .route("/reports")
  .get(verifyJWT, getAll)
  .post(verifyJWT, upload.single('evidence'), create);

reportRouter
  .route("/reports/:id")
  .get(verifyJWT, getOne)
  .delete(verifyJWT, remove)
  .put(verifyJWT, update);

module.exports = reportRouter;
