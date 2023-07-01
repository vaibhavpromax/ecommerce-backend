const express = require("express");
const { createDiscount } = require("../controllers/discount.controller");

const router = express.Router();

router.post("/create-discount", createDiscount);

module.exports = router;
