const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { getDashboard } = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/", protect, getDashboard);

module.exports = router;
