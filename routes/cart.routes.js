const express = require("express");
const { isAuth } = require("../controllers/user/auth.controller");
const { getCart, addToCart } = require("../controllers/cart.controller");
const router = express.Router();

router.get("/get-cart", isAuth, getCart);
router.post("/add-cart", isAuth, addToCart);

module.exports = router;
