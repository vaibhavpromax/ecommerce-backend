const express = require("express");
const {
  get_all_orders,
  get_orders_of_user,
  update_order,
  getOrderDetailsForProfile,
} = require("../controllers/order.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const {
  add_review,
  delete_review,
  getProductReview,
} = require("../controllers/review.controller");

const router = express.Router();

// router.get("/get-orders", authMiddleware, get_all_orders);
// router.post("/create-order", authMiddleware, make_order);

router.get("/get-orders", authMiddleware, getOrderDetailsForProfile);

module.exports = router;
