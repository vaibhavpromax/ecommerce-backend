const express = require("express");
const { add_email } = require("../controllers/under_construction.controller");
const router = express.Router();

router.post("/", add_email);

module.exports = router;
