const express = require("express");

const router = express.Router();

const autenticarToken = require("../middlewares/auth");

const {
    obterDashboard
} = require("../controllers/dashboardController");


router.get(
    "/",
    autenticarToken,
    obterDashboard
);


module.exports = router;