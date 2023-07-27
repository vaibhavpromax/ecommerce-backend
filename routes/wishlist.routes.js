const express = require("express");
const { isAuth } = require("../controllers/user/auth.controller");
const {
  removeFromWishlist,
  createWishlist,
  getWishlist,
} = require("../controllers/wishlist.controller");
const router = express.Router();

router.get("/get-wishlist", isAuth, getWishlist);
router.post("/add-wishlist", isAuth, createWishlist);
router.delete("/remove-wishlist/:id", isAuth, removeFromWishlist);

module.exports = router;
