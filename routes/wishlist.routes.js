const express = require("express");
const { authMiddleware } = require("../controllers/user/auth.controller");
const {
  removeFromWishlist,
  createWishlist,
  getWishlist,
} = require("../controllers/wishlist.controller");
const router = express.Router();

router.get("/get-wishlist", authMiddleware, getWishlist);
router.post("/add-wishlist/:id", authMiddleware, createWishlist);
router.delete("/remove-wishlist/:id", authMiddleware, removeFromWishlist);

module.exports = router;
