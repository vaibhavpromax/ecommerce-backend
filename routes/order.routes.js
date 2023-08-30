const express = require("express");
const {
  get_all_orders,
  get_orders_of_user,
  update_order,
} = require("../controllers/order.controller");
const { authMiddleware } = require("../controllers/user/auth.controller");
const {
  add_review,
  delete_review,
} = require("../controllers/review.controller");

const router = express.Router();

// router.get("/get-orders", authMiddleware, get_all_orders);
router.get("/get-order/:order_id", authMiddleware, get_orders_of_user);
// router.post("/create-order", authMiddleware, make_order);
router.patch("/update-order/:order_id", authMiddleware, update_order);

// reviews
router.post("/add-review", authMiddleware, add_review);
router.delete("/delete-review/:review_id", authMiddleware, delete_review);

module.exports = router;
