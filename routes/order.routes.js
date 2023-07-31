const express = require("express");
const {
  get_orders,
  get_single_order,
  make_order,
  update_order,
} = require("../controllers/order.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const {
  add_review,
  delete_review,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/get-orders", authMiddleware, get_orders);
router.get("/get-order/:order_id", authMiddleware, get_single_order);
router.post("/create-order", authMiddleware, make_order);
router.patch("/update-order/:order_id", authMiddleware, update_order);

// reviews
router.post("/add-review", authMiddleware, add_review);
router.delete("/delete-review/:review_id", authMiddleware, delete_review);

module.exports = router;
