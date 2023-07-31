const express = require("express");
const { authMiddleware } = require("../controllers/user/auth.controller");
const { getCart, addToCart } = require("../controllers/cart.controller");
const router = express.Router();

router.get("/get-cart", authMiddleware, getCart);
router.post("/add-cart", authMiddleware, addToCart);

module.exports = router;
