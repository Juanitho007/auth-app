const express = require('express');
const userRouter = require('./user.router');
const reportRouter = require('./report.router');
const router = express.Router();

// colocar las rutas aquí
router.use(userRouter)
router.use(reportRouter)

module.exports = router;