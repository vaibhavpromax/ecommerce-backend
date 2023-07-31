const express = require("express");
const { get_emails } = require("../controllers/admin.controller");
const {
  createNotification,
} = require("../controllers/notification.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const router = express.Router();

router.get("/get_emails", get_emails);

router.post("/notification/create", createNotification);

module.exports = router;
