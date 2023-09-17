const express = require("express");
const {
  add_review,
  getProductReview,
} = require("../controllers/review.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");

const router = express.Router();

// reviews
router.post("/add-review", authMiddleware, add_review);
router.post("/get-review/:id", getProductReview);

module.exports = router;
