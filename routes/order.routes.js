const express = require("express");
const {
  get_orders,
  get_single_order,
  make_order,
  update_order,
} = require("../controllers/order.controller");
const { isAuth } = require("../controllers/user/auth.controller");
const {
  add_review,
  delete_review,
} = require("../controllers/review.controller");

const router = express.Router();

router.get("/get-orders", isAuth, get_orders);
router.get("/get-order/:order_id", isAuth, get_single_order);
router.post("/create-order", isAuth, make_order);
router.patch("/update-order/:order_id", isAuth, update_order);

// reviews
router.post("/add-review", isAuth, add_review);
router.delete("/delete-review/:review_id", isAuth, delete_review);

module.exports = router;
