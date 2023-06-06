const express = require("express");
const { get_emails } = require("../controllers/admin.controller");
const { getCompleteUserDetails } = require("../controllers/user/user.controller");
const router = express.Router();

router.get("/get_emails", get_emails);

module.exports = router;
